import{u as a,r as c,D as i,j as r,N as u}from"./index-e53bc31e.js";const h=()=>{const{dropbox:e,dropboxDispatcher:o}=a();return c.useEffect(()=>{if(window.location.hash!==""){const t=window.location.hash.replace("#","").split("&").reduce((s,n)=>(s[n.split("=")[0]]=n.split("=")[1],s),{});o({fn:new i({accessToken:t.access_token}),...t});return}e.access_token===""&&e.fn.auth.getAuthenticationUrl(`${window.location}`).then(t=>window.open(t,"_self"))},[e,o]),e.access_token?r.jsx(u,{to:"/me",replace:!0}):r.jsx("h2",{children:"Checking you out…"})};export{h as default};