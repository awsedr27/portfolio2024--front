import React from 'react';
import { useSpinner } from '../../../context/SpinnerContext';
import MoonLoader from "react-spinners/MoonLoader";
import style from "./GlobalSpinner.module.css"
const GlobalSpinner: React.FC = () => {
  const { loading } = useSpinner();

  if (!loading) return null;

  return (
    <div className={style.overlay}>
      <MoonLoader/>
    </div>
  );
};

export default GlobalSpinner;
