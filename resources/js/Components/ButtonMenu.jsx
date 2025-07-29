function ButtonMenu(props) {
    return (
        <button
            type="button"
            onClick={props.onClick}
            disabled={props.disabled}
            className={`px-2 py-1 rounded bg-gray-200/0 hover:bg-gray-200${
                props.className ? ` ${props.className}` : ""
            } ${props.isActive ? "is-active" : ""}`}
        >
            {props.children}
        </button>
    );
}

export default ButtonMenu;
