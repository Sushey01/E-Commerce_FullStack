import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';

const CategoryList = () => {
    type Category = {
        id:number;
        name:string;
        description:string;
    }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-gray-500">All Categories</h1>
        <button className="flex border rounded-3xl p-3 bg-blue-500 text-white hover:bg-blue-600">
          Add New Category
        </button>
      </div>
      <div>
        <div className="flex justify-between px-2 py-6 border rounded-b-none rounded-xl">
          <p>Categories</p>
          <input
            type="text"
            className="border rounded-sm  text-center"
            placeholder="Type name & Enter"
          />
        </div>
        <div className="p-6 flex flex-col border">
          <div className="flex justify-between border-b py-3">
            <p>Name</p>
            <p>Options</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 p-3">
              <button className="border px-1 rounded-sm text-blue-200">+</button>
              <p>Women Clothing & Fashion</p>
            </div>
<div>
  <BsThreeDotsVertical/>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryList
