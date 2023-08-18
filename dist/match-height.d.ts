declare class MatchHeight {
    private _selector;
    private _remains;
    disconnect: () => void;
    constructor(selector?: string);
    update(): void;
    private _process;
}
export default MatchHeight;
