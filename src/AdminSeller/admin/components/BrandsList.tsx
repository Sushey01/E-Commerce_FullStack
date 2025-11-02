import React from 'react'
import { Input } from '../ui/input'
import { BsThreeDotsVertical } from 'react-icons/bs';

const BrandsList = () => {

  type Brand = {
    id:number;
    name:string;
    logoUrl:string;
  }

  const brands: Brand[] = [
    { id: 1, name: 'Acer', logoUrl: '' },
    { id: 2, name: 'Asus', logoUrl: '' },
    { id: 3, name: 'Dell', logoUrl: '' },
  ];

  return (
    <div>
      <div className="w-full flex px-4 py-2 items-center justify-between border-b-2">
        <h2 >Brands</h2>
        <button className="border rounded-sm border-gray-200">
          <input
            type="search"
            placeholder="Type name & Enter"
            className="text-gray-200 p-2 text-center"
          />
        </button>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead className="justify-evenly w-full">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Logo</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Acer</td>
                <td><img src=''/></td>
                <td>
                    <div><BsThreeDotsVertical/></div>
                </td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BrandsList
