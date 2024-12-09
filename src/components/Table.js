import React, { useMemo } from "react";
import { useTable, usePagination, useSortBy, useFilters } from "react-table";

// Default UI for filtering
const DefaultColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setFilter(e.target.value || undefined)} // Set undefined to remove the filter entirely
      placeholder={`Search ${count} records...`}
      style={{ width: "100%" }}
    />
  );
};

const Table = ({ columns, data, setFilteredRows }) => {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageSize: 1000 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  React.useEffect(() => {
    if (setFilteredRows) {
      setFilteredRows(rows.map((row) => row.original));
    }
  }, [rows, setFilteredRows]);

  return (
    <>
      <table {...getTableProps()} style={{ width: "100%", border: "1px solid black" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ borderBottom: "2px solid black", padding: "10px", cursor: "pointer" }}
                >
                  {column.render("Header")}
                  <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                  <div>{column.canFilter ? column.render("Filter") : null}</div> {/* Filter input */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={{ padding: "10px", border: "1px solid gray" }}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </>
  );
};

export default Table;
