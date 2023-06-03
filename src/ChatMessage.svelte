<script>
    import {messageBeingTyped, preloading, words} from './stores.js';
    import { onMount } from 'svelte';
    import RobotIcon from "./RobotIcon.svelte";

    export let message;
    export let index;


    let displayedText = '';
    let previousCleanText = '';


    $: {
        submitGradual($messageBeingTyped)
    }
    async function submitGradual() {
        console.log($messageBeingTyped)
        if($messageBeingTyped === index) {
            for (let i = 0; i < message.text.length; i++) {
                await new Promise(r => setTimeout(r, 10));
                if($preloading){
                    displayedText += message.text[i];
                    if(i+1 < message.text.length){
                        displayedText += message.text[i+1];
                        i++
                    }
                    if(i+1 < message.text.length){
                        displayedText += message.text[i+1];
                        i++
                    }

                }
                else {
                    displayedText += message.text[i];
                }
                console.log($preloading)

            }
            $messageBeingTyped++;
        }

    }

    let highlightedMessage = '';
    $: highlightedMessage = highlightText(displayedText);

    function highlightText(text) {
        const updatedWords = $words.map(item => ({ ...item }));
        const cleanText = text.toLowerCase();
        let matches = [];
        let newGreenWords = new Set();
        let statusChanged = false;

        if (message.sender === 'robot') {
            updatedWords.forEach(item => {
                const cleanWord = item.word.toLowerCase();
                const wordRegex = new RegExp(`${cleanWord}`, 'gi'); // remove word boundary
                let match;

                while (match = wordRegex.exec(cleanText)) {
                    const originalWord = text.slice(match.index, match.index + cleanWord.length);
                    matches.push({
                        index: match.index,
                        word: originalWord,
                        highlightedWord: `<span class="text-lime-500">${originalWord}</span>`,
                        wordLength: cleanWord.length,
                        item: item
                    });
                    newGreenWords.add(cleanWord);
                }
            });

            matches.sort((a, b) => a.index - b.index);

            let newText = '';
            let currentIndex = 0;

            matches.forEach(match => {
                if (currentIndex <= match.index) {
                    newText += text.slice(currentIndex, match.index) + match.highlightedWord;
                    currentIndex = match.index + match.wordLength;
                    if(match.item.status !== 'green') {
                        match.item.status = 'green';
                        statusChanged = true;
                    }
                }
            });

            updatedWords.forEach(item => {
                const cleanWord = item.word.toLowerCase();
                if (item.status === 'green' && !newGreenWords.has(cleanWord)) {
                    item.status = 'yellow';
                    statusChanged = true;
                }
            });

            newText += text.slice(currentIndex);
            if (statusChanged) {
                words.set(updatedWords);
            }

            return newText;
        }

        return text;
    }






</script>

<!-- Rest of the component here -->


{#if message.sender === 'user'}
    <div class="bg-transparent py-4 flex items-center justify-center text-white z-50 w-full">
        <div style="height: 10px;"></div>
        <div class="w-10/12 sm:w-1/3 sm:min-w-[30rem] flex items-center justify-start">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </div>
            <div class="text-xl text-left ml-4">
                <div>{@html highlightedMessage}</div>
            </div>
        </div>
        <div style="height: 10px;"></div>
    </div>
{:else}
    <div class="bg-base-300 py-4 flex items-center justify-center text-white z-50 w-full">
        <div style="height: 10px;"></div>
        <div class="w-10/12 sm:w-1/3 sm:min-w-[30rem] flex items-center justify-start">
            <div>
                <RobotIcon />
            </div>
            <div class="text-xl text-left ml-4">
                <div>{@html highlightedMessage}</div>
            </div>
        </div>
        <div style="height: 10px;"></div>
    </div>
{/if}

<style>
    .message {
        color: white;
    }
    .text-lime-500 {
        color: lime;
    }
</style>
