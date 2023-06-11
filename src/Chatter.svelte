<script>
    import { writable } from 'svelte/store';
    import axios from 'axios';

    // You should import messages from the store where it is defined
    import {messages, systemMessages} from './stores.js';

    // Function to call your AWS Lambda function via API Gateway
    async function callLambda(formattedMessages) {
        try {
            const result = await axios.post("https://nwe0dbevfl.execute-api.us-east-2.amazonaws.com/prod/chat", {
                "messages": formattedMessages
            });
            console.log(result)
            console.log(result.data)
            return result.data.content;
        } catch (error) {
            console.error("Error calling Lambda function:", error);
            try {
                const result = await axios.post("https://nwe0dbevfl.execute-api.us-east-2.amazonaws.com/prod/chat", {
                    "messages": formattedMessages
                });
                console.log(result)
                console.log(result.data)
                return result.data.content;
            } catch (error) {
                console.error("Error calling Lambda function:", error);
                try {
                    const result = await axios.post("https://nwe0dbevfl.execute-api.us-east-2.amazonaws.com/prod/chat", {
                        "messages": formattedMessages
                    });
                    console.log(result)
                    console.log(result.data)
                    return result.data.content;
                } catch (error) {
                    console.error("Error calling Lambda function:", error);
                }
            }
        }
    }


    // Listen for new user messages and call your Lambda function
    messages.subscribe(async ($messages) => {
        if ($messages.length > 0 && $messages[$messages.length - 1].sender === 'user') {
            const postSysMessages = [...$systemMessages, ...$messages]
            // Convert your messages to the format expected by OpenAI API
            const formattedMessages = postSysMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : msg.sender === "system" ? "system" : "assistant",  // OpenAI API expects 'user' or 'assistant' roles
                content: msg.text
            }));


            const lambdaResponse = await callLambda(formattedMessages);
            if (lambdaResponse) {
                messages.update(n => [...n, { sender: 'robot', text: lambdaResponse }]);
            }
            else{
                messages.update(n => [...n, { sender: 'robot', text: "Oops, brain fart, can you ask again?" }]);
            }
        }
    });

</script>
