import{u as k,r as c,j as e}from"./index-DrtFgdp2.js";import{u as C}from"./useQuery-BIV5OyOV.js";import{s as q}from"./foodApi-CphwmNmA.js";import{P as T,B as x,a as F}from"./button-C-oRJGfH.js";import{S as L,P as $}from"./search-bar-Bo2FNUaO.js";import"./useBaseQuery-pKl7XrgZ.js";const U=()=>{var S;const p=k(),g=new URLSearchParams(p.search),j=g.get("q")||"",[t,m]=c.useState(j),[a,f]=c.useState(j),[n,o]=c.useState(1),[N,l]=c.useState([]),b=24;c.useEffect(()=>{const r=g.get("q")||"";m(r),o(1),l([])},[p.search]);const{data:s,isLoading:i,isError:w,error:u,isFetching:d,isPreviousData:v}=C({queryKey:["search",t,n],queryFn:()=>q(t,n,b),enabled:t.length>2,keepPreviousData:!0});c.useEffect(()=>{s!=null&&s.products&&l(n===1?s.products:r=>[...r,...s.products])},[s,n]);const y=r=>{m(r),f(r),o(1),l([]);const h=r?`/search?q=${encodeURIComponent(r)}`:"/search";window.history.pushState({},"",h)},P=()=>{o(r=>r+1)},E=()=>Array(8).fill(0).map((r,h)=>e.jsxs("div",{className:"rounded-lg border bg-card p-4 shadow-sm",children:[e.jsx("div",{className:"aspect-square w-full bg-muted animate-pulse rounded-md"}),e.jsxs("div",{className:"mt-3 space-y-2",children:[e.jsx("div",{className:"h-2 w-16 bg-muted animate-pulse rounded"}),e.jsx("div",{className:"h-4 w-full bg-muted animate-pulse rounded"}),e.jsx("div",{className:"h-3 w-24 bg-muted animate-pulse rounded"})]})]},`skeleton-${h}`));return e.jsxs(e.Fragment,{children:[e.jsx(T,{title:"Search Results",description:a?`Showing results for "${a}"`:"Enter a search term to find products",action:e.jsx(x,{variant:"outline",size:"sm",onClick:()=>{m(""),f(""),window.history.pushState({},"","/search")},disabled:!t,children:"Clear Search"})}),e.jsx("div",{className:"w-full max-w-xl mx-auto mb-8",children:e.jsx(L,{onSearch:y,initialValue:t})}),e.jsxs(F,{children:[!a&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx("h2",{className:"text-xl font-semibold mb-2",children:"Start Searching"}),e.jsx("p",{className:"text-muted-foreground max-w-md mx-auto",children:"Enter at least 3 characters to search for products by name, brand, or ingredients."})]}),t&&t.length>=3&&e.jsxs("div",{className:"space-y-6",children:[!i&&!w&&(s==null?void 0:s.products)&&e.jsx("div",{className:"flex items-center justify-between",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:s.count>0?`Found ${s.count} products matching "${a}"`:`No products found matching "${a}"`})}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",children:[N.map(r=>e.jsx($,{product:r},r.id)),(i||d&&v&&n===1)&&E()]}),((S=s==null?void 0:s.products)==null?void 0:S.length)>0&&(s==null?void 0:s.page)<(s==null?void 0:s.page_count)&&e.jsx("div",{className:"mt-8 text-center",children:e.jsx(x,{onClick:P,disabled:d,variant:"outline",className:"min-w-[150px]",children:d?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"mr-2 h-4 w-4 animate-spin",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Loading..."]}):"Load More"})}),!i&&!d&&a.length>=3&&N.length===0&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx("h2",{className:"text-xl font-semibold mb-2",children:"No products found"}),e.jsx("p",{className:"text-muted-foreground max-w-md mx-auto",children:"Try a different search term or check your spelling."})]}),w&&!i&&e.jsxs("div",{className:"rounded-lg border bg-card p-6 text-center",children:[e.jsx("h3",{className:"text-lg font-medium mb-2",children:"Error loading products"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:(u==null?void 0:u.message)||"Failed to load products. Please try again."}),e.jsx(x,{onClick:()=>o(1),variant:"outline",children:"Retry"})]})]})]})]})};export{U as default};
