<script>
  import { onMount, afterUpdate } from 'svelte';
  import autosize from 'autosize';
  import {maxRobotMessages, messages, robotMessages, words, showAlert, alertText, permittedCharacters, isDone} from "./stores";

  let inputText = "";
  let area;
  let placeholder = "";
  let numChar = $permittedCharacters;
  let errorWord = "";

  onMount(() => {
    autosize(area);
    placeholder = "Start typing...";
    area.style.maxHeight = '192px';
  });

  afterUpdate(() => {
    autosize.update(area);
  });

  function submit() {
    if(inputText.length === 0) {
      return;
    }

    // Convert both inputText and forbidden words to lowercase for comparison
    const lowerCaseInputText = inputText.toLowerCase();
    const forbiddenWord = $words.find(w => lowerCaseInputText.includes(w.word.toLowerCase()));

    if(forbiddenWord) {
      errorWord = forbiddenWord.word;
      usedWord(errorWord);
      return;
    } else {
      errorWord = "";
    }
    if($robotMessages > $maxRobotMessages){
      $isDone = true;
      inputError("Max Interactions Reached");
      return;
    }

    if($messages[$messages.length - 1].sender !== 'robot'){
      return;
    }

    if($isDone){
      return;
    }

    if(isMalicious(inputText)) {
      inputError("Malicious Input Detected");
      inputText = "I'm a loser"
    }


    messages.update(currentMessages => {
      return [...currentMessages, {sender: 'user', text: inputText}];
    });
    inputText = "";
    console.log($messages)
  }

  function inputError(error) {
    $alertText = error;
    $showAlert = true;

    setTimeout(() => {
      $showAlert = false;
    }, 2500);
  }

  function isMalicious(input) {
    const patterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // script tags
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // iframe tags
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, // object tags
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, // embed tags
      /<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, // applet tags
      /\b(onerror|onload|eval|alert|confirm|prompt)\b/gi, // common JavaScript event handlers and functions
      /document\.cookie/gi, // accessing document.cookie
      /window\.location/gi, // accessing window.location
      /\bjavascript:/gi, // JavaScript protocol
      /('|")\s*\+\s*('|")/gi, // string concatenation
      /('|")\s*;\s*('|")/gi, // command termination
      /('|")\s*\|\s*('|")/gi, // pipe character
      /('|")\s*&\s*('|")/gi, // ampersand
      /\bunion\b/gi, // SQL UNION keyword
      /\bselect\b/gi, // SQL SELECT keyword
      /\bdrop\b/gi, // SQL DROP keyword
      /\bdelete\b/gi, // SQL DELETE keyword
      /\binsert\b/gi, // SQL INSERT keyword
      /\bupdate\b/gi, // SQL UPDATE keyword
    ];

    for (let pattern of patterns) {
      if (pattern.test(input)) {
        return true;
      }
    }

    return false;
  }




  function handleInput(event) {
    const value = event.target.value;
    if (value.length > numChar) {
      inputText = value.substring(0, numChar);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  function usedWord(word) {
    console.log(`The word "${word}" is forbidden.`);
  }
</script>

<div class="fixed bottom-0 flex justify-center pb-8 sm:pb-10 w-full">
  <div class="flex w-10/12 sm:w-1/3 sm:min-w-[30rem] items-stretch relative rounded-lg shadow-lg overflow-hidden bg-base-200">
    <textarea
            bind:this={area}
            bind:value={inputText}
            placeholder={placeholder}
            class="theme-input px-4 sm:px-6 py-2 text-base sm:text-lg resize-none transition-all duration-200 ease-in-out flex-grow min-h-6 {inputText.length === numChar || errorWord ? 'border-2 border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style="height: 1.5rem; overflow-y: auto; box-sizing: border-box; padding-right: 60px; z-index: 20;"
            on:input={handleInput}
            on:keydown={handleKeyDown}
    ></textarea>
    <div class="absolute bottom-0 right-0 p-2 cursor-pointer" style="z-index: 40;">
      <button on:click={submit} style="background: none; border: none;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
    <div class="absolute top-2 right-2 text-xs sm:text-sm" style="z-index: 30;">
      {inputText.length}/{numChar}
    </div>
  </div>
</div>
