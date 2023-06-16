import java from "./images/java.png";
import python from "./images/python.png";
import ruby from "./images/ruby.jfif";
import './Test.css';

const courseMap = {
  java: java,
  python1: python,
  ruby1: ruby,
};
function Test({ courceName }) {
  return (
   
    <div className="all">
    <img className="test" src={courseMap[courceName]} alt=" " />
    </div>
      
 
  );
}

export default Test;
