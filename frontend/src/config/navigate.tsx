export default function navigateToPage(page:string){
  switch (page) {
    case "FEED": return "./newFeed"
    default: return "./"
  }
}