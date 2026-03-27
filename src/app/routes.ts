import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Library } from './pages/Library';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/search',
    Component: Search,
  },
  {
    path: '/library',
    Component: Library,
  },
]);
