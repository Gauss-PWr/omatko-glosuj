import { TailSpin } from "react-loader-spinner";
import "./loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <TailSpin color="#f28f2def" radius={2} />
    </div>
  );
};

export default Loading;
