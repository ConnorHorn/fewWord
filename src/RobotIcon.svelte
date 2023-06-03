<script>
    import { onMount } from 'svelte';

    onMount(() => {
        const sparkles = document.querySelectorAll('.sparkle');
        sparkles.forEach((sparkle) => {
            sparkle.addEventListener('click', () => {
                sparkle.classList.toggle('sparkle-active');
            });
        });
    });

</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8">
    <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="red" />
            <stop offset="20%" stop-color="orange" />
            <stop offset="40%" stop-color="yellow" />
            <stop offset="60%" stop-color="green" />
            <stop offset="80%" stop-color="blue" />
            <stop offset="90%" stop-color="indigo" />
            <stop offset="100%" stop-color="red" />
        </linearGradient>
    </defs>
    <path class="sparkle" stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
</svg>

<style>
    .sparkle {
        fill: none;
        stroke-width: 1.5;
        animation: sparkle-animation 10s linear infinite;
    }

    @keyframes sparkle-animation {
        0% {
            stroke: red;
        }
        16.67% {
            stroke: orange;
        }
        33.33% {
            stroke: yellow;
        }
        50% {
            stroke: green;
        }
        66.67% {
            stroke: blue;
        }
        83.33% {
            stroke: indigo;
        }
        100% {
            stroke: red;
        }
    }
</style>