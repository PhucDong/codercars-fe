import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import HomePage from "../pages/HomePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomePage />} />
    </Route>
  )
);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
