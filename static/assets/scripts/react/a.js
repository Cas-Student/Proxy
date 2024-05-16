function LoadTitle() {
    return "Hacker Hub";
}

const container = document.getElementsByClassName("title");
const root = ReactDom.createRoot(container);
root.render(<LoadTitle />);
