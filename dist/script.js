const wordsArray = [
    "time",
    "year",
    "people",
    "way",
    "day",
    "man",
    "thing",
    "woman",
    "life",
    "child",
    "world",
    "school",
    "state",
    "family",
    "student",
    "group",
    "country",
    "problem",
    "hand",
    "part",
    "place",
    "case",
    "week",
    "company",
    "system",
    "program",
    "question",
    "work",
    "government",
    "number",
    "night",
    "point",
    "home",
    "water",
    "room",
    "mother",
    "area",
    "money",
    "story",
    "fact",
    "month",
    "lot",
    "right",
    "study",
    "book",
    "eye",
    "job",
    "word",
    "business",
    "issue",
    "side",
    "kind",
    "head",
    "house",
    "service",
    "friend",
    "father",
    "power",
    "hour",
    "game",
    "line",
    "end",
    "member",
    "law",
    "car",
    "city",
    "community",
    "name",
    "president",
    "team",
    "minute",
    "idea",
    "kid",
    "body",
    "information",
    "back",
    "parent",
    "face",
    "others",
    "level",
    "office",
    "door",
    "health",
    "person",
    "art",
    "war",
    "history",
    "party",
    "result",
    "change",
    "morning",
    "reason",
    "research",
    "girl",
    "guy",
    "moment",
    "air",
    "teacher",
    "force",
    "education",
];

const form = document.querySelector("#form");
const word = document.querySelector("#word");
const container = document.querySelector("#container")
const apiKey = `ZvfMk38eFALbBFHUR1JMqc9XbHgwyTuMuGWLwKsgEgill6k6iy2z72TU`;
const numberOfImages = 1;

async function getSearchImage(x, page) {
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${x}&page=${page}&per_page=${numberOfImages}`,
            {
                headers: {
                    Authorization: apiKey,
                },
            }
        );
        
        if (response.ok) {
            const data = await response.json();
            const photo = data.photos[0]?.src.original;
            // console.log(data )
            return photo;
        } else {
            console.error("Failed to fetch curated photos. Status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching curated photos:", error);
    }
}
const getData = async function (word) {
    const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!res.ok) {
        return;
    }
    const data = await res.json();
    const definition = data[0]?.meanings[0]?.definitions[0]?.definition
    const example = data[0]?.meanings[0]?.definitions[0]?.example
    const phonetic = data[0]?.phonetic
    const phonetics = data[0]?.phonetics[0]?.audio
    const wordData = {
        word,
        phonetic,
        meaning: definition,
        phonetics,
    };

    return wordData;
};
async function appendHtml(imgUrl, data) {
    let loader = `
    <div class="h-96 rounded-2xl  bg-purple-300 flex items-center justify-center">
        <div class="h-16 w-16 bg-transparent loader" style="border-radius: 50% 50% 50% 0%;border-top: 5px solid black;border-right: 5px solid black;">

        </div>
    </div>`
    container.innerHTML = loader
    const i = await imgUrl;
    const datax = await data;
    if (!datax && !i) {
        container.innerHTML = `
        <div class="h-96 rounded-2xl  bg-purple-300 flex items-center justify-center">
            <h1>Try Again (Not Found)</h1>
        </div>`
    }
    // console.log(datax ,i)
    let html =
        `<div class="h-fit rounded-2xl  bg-purple-300 p-5">
        <div class="flex items-center gap-4">
            <h1 class="text-4xl font-bold ">
                ${word.value}
            </h1>
            <audio controls>
            <source src="${datax?.phonetics}" type="audio/mp3">
            Your browser does not support the audio element.
            </audio>
        </div>
        <p>[${datax ? datax.phonetic : "Not Found"} ]</p>                                        
        <h1 class="text-xl font-bold ">
        Meaning
        </h1>
        <p>${datax ? datax.meaning : "Not Found"}</p>
        <div class="w-full h-80 overflow-hidden mt-4 flex items-center justify-center">
            <div class="h-16 w-16 bg-transparent loader" style="border-radius: 50% 50% 50% 0%;border-top: 5px solid black;border-right: 5px solid black;" id='as'>

            </div>
            <img src=${i}  class="w-full h-full object-cover rounded-2xl hidden transition-opacity opacity-0" id='asd'>
        </div>
    </div>`
    if (datax || i) {
        container.innerHTML = html
    }

    document.querySelector("#asd").addEventListener("load", () => {
        document.querySelector("#as").classList.add("hidden")
        document.querySelector("#asd").classList.remove("hidden")
        document.querySelector("#asd").style.opacity = 1
    })
}
async function appendHtmlx(imgUrl, data ,el) {
    const i = await imgUrl;
    const datax = await data;
    if (!datax && !i) {
        return `
        <div class="h-96 rounded-2xl  bg-purple-300 flex items-center justify-center">
            <h1>Try Again (Not Found)</h1>
        </div>`
    }
    if (datax || i) {
        return `<div class="h-fit rounded-2xl  bg-purple-300 p-5">
        <div class="flex items-center gap-4">
            <h1 class="text-4xl font-bold ">
                ${el}
            </h1>
            <audio controls>
            <source src="${datax?.phonetics}" type="audio/mp3">
            Your browser does not support the audio element.
            </audio>
        </div>
        <p>[${datax ? datax.phonetic : "Not Found"} ]</p>                                        
        <h1 class="text-xl font-bold ">
        Meaning
        </h1>
        <p>${datax ? datax.meaning : "Not Found"}</p>
        <div class="w-full h-80 overflow-hidden mt-4 flex items-center justify-center">
            <img src=${i}  class="w-full h-full object-cover rounded-2xl" id='asd'>
        </div>
    </div>`
    }
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    appendHtml(getSearchImage(word.value, 1), getData(word.value))
});