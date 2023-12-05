import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const usePersonasTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoadingTable } = useSelector((state) => state.ui);

  return {
    isLoadingTable,
  };
};