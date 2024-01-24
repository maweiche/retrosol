export default function Hangman_Rules() {

    return(
        <div
            className="z-10 inset-20 overflow-y-auto gap-4 flex flex-col p-6 justify-center items-center bg-gray-500 bg-opacity-75 border-2 border-black rounded-lg h-fit-content w-fit-content"
        >
            <h1>Hangman Rules</h1>
            <ol className="list-decimal list-inside space-y-6">
                <li>
                    Hangman is a game where you try to guess the word before you run out of guesses.
                </li>
                <li>
                    The creator of the game sets the word (must be in dictionary), entry fee, prize amount, and number of plays allowed.
                </li>
                <li>
                    Players take turns guessing letters in the word. If the letter is in the word, it is revealed. If not, the player loses a guess and a body part is added to the hangman.
                </li>
                <li>
                    If the player guesses the word before they run out of guesses, they win the prize amount and the game is no longer playable.
                </li>
                <li>
                    When the game is no longer playable, the creator can withdraw the prize amount, entry fees, and rent from the contract.
                </li>
            </ol>
        </div>
    )
};