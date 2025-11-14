import React from 'react'

interface CookiesProps {
    clicked: boolean;
}

const CookiesPopUp = () => {
    const [clicked, setClicked] = React.useState(false);

    function handleClick(){
        setClicked(true);
    }
  return (
    <div className="flex-col p-3 px-6 fixed lg:w-[310px] left-3 bottom-2 border rounded-none  bg-white w-full md:w-1/3 flex justify-between items-center gap-4 z-50 ">
      <h1 className="text-gray-700 text-start font-inter text-sm">
        We use cookie for better user experience, check our policy
        <span>
          <a href="/cookie-policy" className="font-inter text-blue-500 ml-1">
            here
          </a>
        </span>
      </h1>
      <button
      type='submit'
      value={clicked}
      onClick={()=>{handleClick}}
      className="bg-blue-600 w-full font-inter  text-white p-2 px-4 border text-sm rounded-none text-center">
        Ok, I Understood
      </button>
    </div>
  );
}

export default CookiesPopUp
