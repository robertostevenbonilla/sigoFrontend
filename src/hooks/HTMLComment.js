import React, { useRef, useEffect } from 'react';

export default function HTMLComment({ comment }) {
  const ref = useRef();

  useEffect(() => {        
    ref.current.outerHTML = `<!--${comment}-->`;     
  }, [comment]);     

  return (
    <script ref={ref} type="text/placeholder" />
  );
}