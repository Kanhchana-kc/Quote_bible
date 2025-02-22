const API = "./quotes.json";  // Path to your local JSON file
const quoteText = document.querySelector(".quote"),
      khmerQuoteText = document.querySelector(".khmer-quote"),
      authorName = document.querySelector(".author .name"),
      quoteBtn = document.querySelector("button");

let isSpeaking = false; // To track if the speech is playing or not
let utterance; // To store the SpeechSynthesisUtterance

// Function to fetch a random quote and update the page
function randomQuote() {
    // quoteBtn.innerText = "Loading Quote...";  // Change button text while fetching

    // Fetch the quotes from the local JSON file
    fetch(API)
        .then(res => res.json())
        .then(quotes => {
            // Log the response to check
            console.log(quotes);

            // Pick a random quote from the fetched data
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];

            // Display the quote and author in English
            quoteText.innerText = `"${randomQuote.content}"`;
            authorName.innerText = `- ${randomQuote.author}`;

            // Display the Khmer translation of the quote
            khmerQuoteText.innerText = `"${randomQuote.khmer_content}"`;

            // Reset button text after the quote is displayed
            quoteBtn.innerText = "Get Another";
        })
        .catch(err => {
            // Handle any errors
            console.error(err);
            quoteText.innerText = "An error occurred";
            authorName.innerText = "Unknown";
            khmerQuoteText.innerText = ""; // Clear the Khmer translation if error occurs
            quoteBtn.innerText = "Try Again";
        });
}


// Event listener for button click
quoteBtn.addEventListener("click", randomQuote);

// Direct copy of quote and Khmer translation without selection
document.querySelector(".copy").addEventListener("click", () => {
    const quote = quoteText.innerText;
    const khmerQuote = khmerQuoteText.innerText;

    // Combine the English and Khmer quotes into one string
    const fullQuote = `${quote}\n\n${khmerQuote}`;

    // Copy the combined quote to the clipboard
    navigator.clipboard.writeText(fullQuote).then(() => {
        alert("Quote copied to clipboard!");
    }).catch(err => {
        console.error("Error copying text: ", err);
    });
});

document.querySelector(".sound").addEventListener("click", () => {
    console.log("Button clicked");
    const soundIcon = document.querySelector(".sound i");
    if (isSpeaking) {
        console.log("Stopping speech");
        speechSynthesis.cancel();
        isSpeaking = false;
        soundIcon.classList.remove("fa-volume-slash");
        soundIcon.classList.add("fa-volume-up");
    } else {
        console.log("Starting speech");
        const quote = quoteText.innerText;
        const khmerQuote = khmerQuoteText.innerText;
        utterance = new SpeechSynthesisUtterance(quote + " " + khmerQuote);
        utterance.lang = "en-US"; // Or adjust to the desired language
        speechSynthesis.speak(utterance);
        isSpeaking = true;
        soundIcon.classList.remove("fa-volume-up");
        soundIcon.classList.add("fa-solid fa-stop");
    }
});

// // Twitter functionality (share to Twitter) with confirmation
// document.querySelector(".twitter").addEventListener("click", () => {
//     if (confirm("Do you want to share this quote on Twitter?")) {
//         const quote = quoteText.innerText;
//         const khmerQuote = khmerQuoteText.innerText;

//         const tweet = encodeURIComponent(`${quote}\n${khmerQuote}`);
//         const twitterUrl = `https://twitter.com/intent/tweet?text=${tweet}`;

//         window.open(twitterUrl, '_blank');
//     }
// });
