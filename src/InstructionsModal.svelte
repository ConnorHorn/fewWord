<script>
    import { showInstructModal } from './stores.js';
    import { fade } from 'svelte/transition';
    import RobotIcon from "./RobotIcon.svelte";

    const close = () => {
        showInstructModal.set(false);
    };
</script>

<style>
    .title-container {
        display: flex;
        align-items: center;
    }

    .title-container h2 {
        margin-right: 5px;
    }

    .robot-icon {
        display: flex;
        align-self: center;
    }
</style>

{#if $showInstructModal}
    <div class='fixed z-50 top-0 left-0 w-full h-screen bg-black bg-opacity-50' on:click={close}
         transition:fade={{ duration: 300 }}>
        <div class='absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-300 w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 2xl:w-1/3 rounded-lg p-2 sm:p-5 text-sm sm:text-base text-center text-neutral-content transition duration-500'
             on:click|stopPropagation>
            <div class="absolute right-1 sm:right-3 top-1 sm:top-3 cursor-pointer text-neutral-content text-3xl" on:click={close}>×</div>
            <div class="title-container flex items-center">
                <h2 class="text-2xl sm:text-3xl font-extrabold mb-2 sm:mb-4">How to play fewWord</h2>
<!--                <div class="robot-icon"><RobotIcon/></div>-->
            </div>
            <ul class="list-disc list-inside text-left space-y-1 sm:space-y-3">
                <li>Your objective is to prompt a GPT-based chatbot to say the three words listed in the sidebar, using as few messages as possible. However, the words can appear within other words</li>
                <li>Each message you send should not exceed 60 characters.</li>
                <li>The chatbot is told to avoid simply parroting synonyms or combining two words from your messages, but its responses can be unpredictable.</li>
                <li>In the sidebar, a ❌ next to a word means that the chatbot hasn't said it yet. A ✅ means the chatbot used that word in its last response, and a 🟡 means the chatbot has used the word before, but not in the most recent message.</li>
                <li>Your ultimate goal is to get the chatbot to use all three words in a single response. However, this can be challenging, so don't hesitate to share your results even if it takes multiple messages to get all three words.</li>
                <li>Keep in mind that the chatbot's responses will generally be brief and you are capped at 10 responses, so plan your messages accordingly.</li>
            </ul>
        </div>
    </div>
{/if}
