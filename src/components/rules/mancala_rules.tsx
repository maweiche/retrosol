export default function Mancala_Rules() {

    return(
        <div
            className="z-10 inset-20 overflow-y-auto gap-4 flex flex-col p-6 justify-center items-center bg-gray-500 bg-opacity-75 border-2 border-black rounded-lg h-fit-content w-fit-content"
        >
            <h1>Mancala Rules</h1>
            <ol className="list-decimal list-inside space-y-6">
                <li>
                    Mancala is a game where you try to collect more stones than your opponent.
                </li>
                <li>
                    Each player has a 6x2 grid where they place their stones. The stones are placed in the holes in the grid.
                </li>
                <li>
                    Players take turns moving stones from their grid to their opponent&apos;s grid. If the last stone lands in an empty hole, the player collects that stone and all of the stones in the hole opposite of it.
                </li>
                <li>
                    If the last stone lands in the player&apos;s score pit, they get another turn.
                </li>
                <li>
                    When creating a game, the creator sets the entry fee. The entry fee is the amount of SOL that each player must pay to play the game. The entry fee is sent to the contract and is used as the prize for the winner.
                </li>
                <li>
                    The game starts when both players have paid the entry fee.
                </li>
                <li>
                    The game ends when one player has 0 stones left on their side, at which point the winner is the whoever has more stones in their score pit and can withdraw the Loot from the contract (entry fee x 2).
                </li>
            </ol>
        </div>
    )
};