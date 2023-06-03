<script>
    import { writable } from 'svelte/store';
    import {gameNumber, showDoneModal} from './stores.js';
    import { fade } from 'svelte/transition';
    import {gameData, maxRobotMessages, messages} from "./stores";

    let buttonText = writable('Share Game Data');

    const close = () => {
        showDoneModal.set(false);
    };

    const shareGameData = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Game Data',
                    text: 'Check out my game data!',
                    url: `data:text/plain;charset=utf-8,${encodeURIComponent($gameData)}`
                });
            } catch (err) {
                console.error('There was an error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(getShareGameData());
                buttonText.set('Copied to Clipboard');
            } catch (err) {
                console.error('Could not copy text: ', err);
            }
        }
    };

    function getShareGameData(){
       return "fewWord "+$gameNumber+ "\n"+$gameData;
    }
</script>

{#if $showDoneModal}
    <div class='fixed z-50 top-0 left-0 w-full h-screen bg-black bg-opacity-50' on:click={close}
         transition:fade={{ duration: 600 }}>
        <div class='absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-300 w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 2xl:w-1/3 rounded-lg p-2 sm:p-5 text-sm sm:text-base text-center text-neutral-content transition duration-500'
             on:click|stopPropagation>
            <div class="absolute right-1 sm:right-3 top-1 sm:top-3 cursor-pointer text-neutral-content text-3xl" on:click={close}>×</div>
            <h2 class="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{"fewWord #"+$gameNumber+"!"}</h2>
            {@html $gameData.replace(/\n/g, "<br>")}
            <button class="btn btn-primary mt-4" on:click={shareGameData}>{$buttonText}</button>
        </div>
    </div>
{/if}
