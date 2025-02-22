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

// Sound functionality (Text to Speech) with Play/Stop toggle using the icon
document.querySelector(".sound").addEventListener("click", () => {
    const soundIcon = document.querySelector(".sound i"); // Get the sound icon

    if (isSpeaking) {
        // If already speaking, stop the speech
        speechSynthesis.cancel();
        isSpeaking = false;
        soundIcon.classList.remove("fa-volume-slash"); // Remove the "Stop" icon
        soundIcon.classList.add("fa-volume-up"); // Add the "Play" icon
    } else {
        // If not speaking, start speaking the quote
        const quote = quoteText.innerText;
        const khmerQuote = khmerQuoteText.innerText;

        utterance = new SpeechSynthesisUtterance(quote + " " + khmerQuote);
        speechSynthesis.speak(utterance);
        isSpeaking = true;
        soundIcon.classList.remove("fa-volume-up"); // Remove the "Play" icon
        soundIcon.classList.add("fa-solid fa-stop"); // Add the "Stop" icon
    }
});

// Fetch the navbar HTML content
fetch('navbar.html')
    .then(response => response.text())  // Read the HTML file as text
    .then(data => {
        // Insert the navbar HTML into the placeholder div
        document.getElementById('navbar-placeholder').innerHTML = data;
    })
    .catch(error => {
        console.error("Error loading navbar:", error);
        // If an error occurs, display a message
        document.getElementById('navbar-placeholder').innerHTML = "<p>Navbar could not be loaded.</p>";
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
