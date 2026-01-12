import React from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import Query from 'query-string'

const Pagination = ({ totalPages = 10, setPage= ()=>{} }) => {
  const location = useLocation();
  const query = Query.parse(location.search);

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1; 
  const navigate = useNavigate()

  const handleNavigation = (direction) => {
    const newPage = direction === "prev" ? page - 1 : page + 1;
    query.page = newPage;
    setPage(newPage);
    navigate({ path : `${location.pathname}`, search : Query.stringify(query)});
  }

  return (
    <div className="pagination w-full items-center flex flex-row justify-center pt-2 gap-4">
      <button
        className="rounded-lg px-2 py-1 border border-teal-600 auth-button disabled:hover:before:h-0 disabled:hover:shadow-none disabled:hover:text-current disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => handleNavigation('prev')}
        disabled={page == 1}
      >
        Prev
      </button>
      <p className="px-4 mx-1 border-r border-l border-slate-900">{page}</p>
      <button
        className="rounded-lg px-2 py-1 border border-teal-600 auth-button disabled:hover:before:h-0 disabled:hover:shadow-none disabled:hover:text-current disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => handleNavigation('next')}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
