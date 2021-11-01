export default function Intro(props) {
  return (
    <div className="absolute top-0 left-0 z-50 w-screen h-screen bg-gray-800 flex justify-center items-center">
      <div
        className="w-24 h-24 bg-gray-600 flex justify-center items-center rounded-full border-dashed border-red-500 border-2"
        onClick={() => props.setStart(false)}
      >
        <i className="fal fa-plus"></i>
      </div>
    </div>
  );
}
