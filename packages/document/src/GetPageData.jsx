import { usePageData } from 'rspress/runtime';

export default function GetPageData() {
  const pageData = usePageData();
  console.debug(pageData);
  return <div></div>;
}
