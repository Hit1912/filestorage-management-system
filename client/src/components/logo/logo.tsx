import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";

const Logo = (props: { url?: string }) => {
  return (
    <Link
      to={props.url || PROTECTED_ROUTES.OVERVIEW}
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-2">
        <img src="/src/assets/logo.png" alt="DHR Nest Logo" className="w-10 h-10 object-contain" />
        <h1 className="relative flex select-none flex-row items-baseline font-bold text-2xl lg:text-3xl">
          <span className="sr-only">DHR Nest</span>
          <span className="tracking-tight cursor-pointer">
            DHR <span className="text-primary">Nest</span>
          </span>
        </h1>
      </div>
    </Link>
  );
};

export default Logo;
