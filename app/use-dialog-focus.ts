'use client';
import { useEffect, type RefObject } from 'react';
export function useDialogFocus(ref:RefObject<HTMLElement|null>,open:boolean){
  useEffect(()=>{
    if(!open)return;
    const previous=document.activeElement as HTMLElement|null;
    const dialog=ref.current;if(!dialog)return;
    const selector='button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select, textarea, [tabindex="0"]';
    const items=()=>Array.from(dialog.querySelectorAll<HTMLElement>(selector)).filter(element=>element.getClientRects().length>0);
    items()[0]?.focus();
    const onKey=(event:KeyboardEvent)=>{if(event.key!=='Tab')return;const controls=items(),first=controls[0],last=controls.at(-1);if(!first){event.preventDefault();return;}if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last?.focus();}else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus();}};
    dialog.addEventListener('keydown',onKey);
    return()=>{dialog.removeEventListener('keydown',onKey);previous?.focus();};
  },[open,ref]);
}
