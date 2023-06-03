<script>
    import {writable} from 'svelte/store';
    import RobotIcon from "./RobotIcon.svelte";
    import {words, showInstructModal} from "./stores";
    import {sidebarOpen, gameNumber} from "./stores";

    const isLargeScreen = writable(false);
    const mql = window.matchMedia('(min-width: 920px)');

    const checkScreenSize = (e) => {
        isLargeScreen.set(e.matches);
        if (e.matches) {
            sidebarOpen.set(false);
        }
    };

    function clearLocalStorage() {
        localStorage.clear();
        $gameNumber = -1
    }

    mql.addListener(checkScreenSize);
    checkScreenSize(mql);
</script>

<div class="h-screen flex bg-light-blue-100">
    <div class="fixed inset-y-0 z-30 transform translate-x-0 w-56 bg-base-300 overflow-auto transition-all duration-300"
         class:translate-x-0={($isLargeScreen || $sidebarOpen)}
         class:-translate-x-full={(!$isLargeScreen && !$sidebarOpen)}>
        <!-- Sidebar content -->
        <ul class="mt-6">
            <li class="relative px-6 py-3 hover:bg-secondary-focus">
                <button class="flex items-center w-full text-left" on:click={clearLocalStorage}>
                    <svg class="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <RobotIcon/>
                    </svg>
                    <span class="inline-flex text-2xl text-white font-extrabold">
            <span>fewWord</span>
            <small class="text-xs font-bold">beta</small>
        </span>
                </button>
            </li>



            {#each $words as word}
                <li class="relative px-6 py-3 flex justify-center items-center">
                    <button class="flex items-center w-full text-left">
      <span class="text-2xl font-medium font-bold {word.status === 'green' ? 'text-lime-500' : 'text-white'}">
        {word.word + "  " + (word.status === 'green' ? '✅' : word.status === 'red' ? '❌' : '🟡')}
      </span>
                    </button>
                </li>
            {/each}

            <li class="relative px-6 py-3 hover:bg-secondary-focus">
                <button class="flex items-center w-full text-left" on:click={() => showInstructModal.set(true)}>
                    <svg class="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                             stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
                        </svg>

                    </svg>
                    <span class="text-2xl font-medium text-white font-bold">
           &nbsp Help
          </span>
                </button>
            </li>

            <!-- More options -->
        </ul>
    </div>
    <div class="w-full">
        <!-- Main Content -->
        {#if !$isLargeScreen}
            <!-- Hamburger/X button -->
            <button class="p-2 absolute z-40 bg-base-300 rounded-full m-4 transform transition-all duration-300"
                    style="left: {$sidebarOpen ? '225px' : '10px'}"
                    on:click={() => sidebarOpen.update(n => !n)}>
                <!-- Hamburger Icon / X Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     class="h-6 w-6">
                    {#if $sidebarOpen}
                        <!-- X Icon -->
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"></path>
                    {/if}
                    {#if !$sidebarOpen}
                        <!-- Hamburger Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>

                    {/if}
                </svg>
            </button>
        {/if}
    </div>
</div>

<style>
    .w-56 {
        width: 225px;
    }
</style>
