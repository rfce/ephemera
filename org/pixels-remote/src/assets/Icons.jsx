const RightArrow = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="#000"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12.293 4.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414-1.414L17.586 13H4a1 1 0 1 1 0-2h13.586l-5.293-5.293a1 1 0 0 1 0-1.414Z"
      clipRule="evenodd"
    />
  </svg>
)

const PlusIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="#030708"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M10 1H6v5H1v4h5v5h4v-5h5V6h-5V1Z" />
  </svg>
)

export {
    RightArrow,
    PlusIcon
}
