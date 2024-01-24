export default function Battleship_Rules() {

    return(
        <div
            className="z-10 inset-20 overflow-y-auto gap-4 flex flex-col p-6 justify-center items-center bg-gray-500 bg-opacity-75 border-2 border-black rounded-lg h-fit-content w-fit-content"
        >
            <h1>Battleship Rules</h1>
            <ol className="list-decimal list-inside space-y-6">
                <li>
                    Battleship is a game where you try to sink your opponent&apos;s ships before they sink yours.
                </li>
                <li>
                    Each player has a 5x10 grid where they place their ships. The ships have a minimum of 2 units long, with 14 units in total.
                </li>
                <li>
                    Players take turns firing at their opponent&apos;s grid. If a ship is hit, the player is notified and a green square with a X appears. If it is a miss, a O appears.
                </li>
                <li>
                    When creating a game, the creator sets the entry fee. The entry fee is the amount of SOL that each player must pay to play the game. The entry fee is sent to the contract and is used as the prize for the winner.
                </li>
                <li>
                    The game starts when both players have paid the entry fee and have set their ships placement.
                </li>
                <li>
                    The game ends when one player has sunk all of their opponent&apos;s ships, at which point the winner can withdraw the Loot from the contract (entry fee x 2).
                </li>
            </ol>
        </div>
    )
};