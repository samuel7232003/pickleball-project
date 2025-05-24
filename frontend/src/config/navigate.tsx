export default function navigateToPage(page:string){
  switch (page) {
    case "FEED": return "/newFeed";
    case "SEARCH": return "/search";
    case "LOGIN": return "/login";
    case "SIGNUP": return "/signup";
    case "CREATE_COURT": return "/createCourt";
    default: return "/";
  }
}