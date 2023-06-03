<script>
    import {onMount, tick} from "svelte";
    import {fly} from 'svelte/transition';
    import Input from "./Input.svelte";
    import Sidebar from "./Sidebar.svelte";
    import ChatMessage from './ChatMessage.svelte';
    import {
        alertText,
        customGame,
        doneLoading,
        gameData,
        gameNumber,
        hasWon,
        isDone,
        messages,
        preloading,
        robotMessages,
        showAlert,
        showDoneModal, startDate,
        urlData, wordList,
        words
    } from "./stores";
    import Chatter from "./Chatter.svelte";
    import confetti from 'canvas-confetti';
    import InstructionsModal from "./InstructionsModal.svelte";
    import {get} from 'svelte/store';
    import DoneModal from "./DoneModal.svelte";

    let explodeConfetti;

    onMount(async () => {
        explodeConfetti = () => {
            confetti({
                particleCount: 300,
                startVelocity: 90,
                spread: 180,
                origin: {
                    x: 0.5,
                    y: 1
                }
            });
        };
    });

    onMount(() => {
$gameNumber= getGameNumber();
// if($gameNumber !== == getLocalStorage('gameNumber')){
//     setLocalStorage('gameNumber', $gameNumber);
//     setLocalStorage('words', []);
//     setLocalStorage('messages', []);
// }
//         console.log(getLocalStorage('gameNumber'
// console.log($gameNumber)
//         console.log($wordList[0])

        const hash = window.location.hash;
         // Remove the leading "#"
        $urlData = hash.substring(1);
        console.log($urlData)
        if($urlData !== '') {
            $customGame = true;
            $words=$urlData.split(',').map(word => ({ word, status: 'red' }));
        }
        else{
            $customGame = false;
            console.log("here")
            if(getLocalStorage('gameNumber') === $gameNumber || getLocalStorage('gameNumber') === null){
                doPreloading()
                console.log("here2")
            const storedWords = getLocalStorage('words');
            const storedMessages = getLocalStorage('messages');
            console.log(storedWords)
            if (storedWords !== null) {
                $words = storedWords;
            }

            if (storedMessages !== null) {
                $messages = storedMessages;
            }
        }
    }
        $doneLoading=true;
    });

    $: {
        if($doneLoading && !$customGame)
        setLocalStorage('words', $words);
    }

    $: {
        if($doneLoading && !$customGame)
        setLocalStorage('messages', $messages);
    }

    $: {
        if($doneLoading && !$customGame)
        setLocalStorage('gameNumber', $gameNumber);
    }

    function setLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function doPreloading(){
            $preloading = true;
        setTimeout(() => {
            $preloading = false;
            if($isDone){
                $isDone = false;
                $isDone = true;
            }
        }, 2500);

    }

    function getLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }


    let endOfMessages;

    $: $messages, scrollToBottom()
    $: $words, checkDone()
    $: $isDone, doneModalTime()

    async function scrollToBottom() {
        // Wait for the DOM updates to complete
        await tick();

        if (endOfMessages) {
            endOfMessages.scrollIntoView({behavior: 'smooth'});
        }
    }
    function checkDone() {
    if($words.every(word => word.status === 'green')) {
        winner()
    }
        console.log($words)
        console.log($words.every(word => word.status === 'green'))
    }
    function winner() {
        if(!$hasWon) {
            explodeConfetti()
            console.log("you win")
        }
        $hasWon = true
        $isDone = true
    }

    function doneModalTime(){
        if($isDone && !$preloading) {
            setTimeout(() => {
                $showDoneModal = true;
            }, 1500);
            console.log(generateGameData())
        }
    }

    function getGameNumber() {
        let today = new Date();
        let timeDifference = today.getTime() - $startDate.getTime();
        return Math.floor(timeDifference / (1000 * 3600 * 24));
    }

    function countRobotMessages() {
        const messagesList = get(messages);
        $robotMessages = messagesList.filter(msg => msg.sender === 'robot').length;
    }

    messages.subscribe(() => {
        countRobotMessages();
    });

    let seenWords = new Map();

    function generateGameData() {
        $gameData = '';
        let skipFirst = true;
        $messages.forEach(message => {
            if (message.sender === 'robot') {
                if (skipFirst) {
                    skipFirst = false;
                    return;
                }
                let wordFlags = new Map();

                $words.forEach(wordObj => {
                    if (seenWords.has(wordObj.word.toLowerCase())) {
                        wordFlags.set(wordObj.word.toLowerCase(), '🟡');
                    } else {
                        wordFlags.set(wordObj.word.toLowerCase(), '❌');
                    }
                });

                let messageWords = message.text.toLowerCase().replace(/[.,!?]/g, '').split(' ');

                messageWords.forEach(messageWord => {
                    wordFlags.forEach((value, key) => {
                        if (messageWord.includes(key)) {
                            wordFlags.set(key, '✅');
                            if (!seenWords.has(key)) {
                                seenWords.set(key, true);
                            }
                        }
                    });
                });

                let line = '';

                wordFlags.forEach(status => {
                    line += status;
                });

                $gameData += line + '\n';
            }
        });
        return $gameData;
    }

</script>

<div class="h-screen flex flex-col z-40">
    <div style="flex: 1;" class="overflow-y-auto flex z-70">
        <div class="w-1/5 absolute">
            <Sidebar/>
        </div>

        <main class="w-full pl-1/5">
            {#each $messages as message, index (index)}
                <ChatMessage {message} {index}/>
            {/each}
            <!-- Invisible element at the end of the messages -->
            <div style="height: 115px;" bind:this={endOfMessages}></div>
        </main>
    </div>

    <div style="flex: none;" class="z-10">
        <Input/>
    </div>
    <InstructionsModal/>
    <DoneModal/>
</div>

<Chatter/>

{#if $showAlert}
    <div transition:fly="{{ y: 200, duration: 2000 }}" class="fixed top-0 left-0 w-full z-50">
        <div class="alert alert-warning">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>

                </svg>
                <label>{$alertText}</label>
            </div>
        </div>
    </div>
{/if}

