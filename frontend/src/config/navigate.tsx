export default function navigateToPage(page:string){
  switch (page) {
    case "FEED": return "./newFeed";
    case "SEARCH": return "./search";
    default: return "./";
  }
}