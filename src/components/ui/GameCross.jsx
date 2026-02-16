const GameCross = () => {
    return <span className="fixed top-3 right-3">
        <button type="button" className="bg-black/20 rounded-full text-white p-1" onClick={() => console.log('exit')}>
            <img src="/icons/cross.svg" alt="cross" className="h-7 w-7"/>
        </button>
    </span>
}

export default GameCross;