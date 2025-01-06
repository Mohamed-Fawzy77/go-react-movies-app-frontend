import React, { useMemo, useState } from "react";
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

// Multi-Select Filter Component
const MultiSelectFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = useMemo(() => {
    // Extract unique values for the column
    const optionsSet = new Set();
    preFilteredRows.forEach((row) => {
      optionsSet.add(row.values[id]);
    });
    return [...optionsSet];
  }, [id, preFilteredRows]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (value) => {
    let newFilterValue = filterValue || [];
    if (newFilterValue.includes(value)) {
      newFilterValue = newFilterValue.filter((v) => v !== value); // Remove value
    } else {
      newFilterValue.push(value); // Add value
    }
    setFilter(newFilterValue.length ? newFilterValue : undefined); // Apply filter or clear
  };

  return (
    <div>
      <button onClick={toggleDropdown} style={{ width: "100%", cursor: "pointer" }}>
        Filter
      </button>
      {isOpen && (
        <div
          style={{
            border: "1px solid gray",
            padding: "5px",
            position: "absolute",
            background: "white",
            zIndex: 10,
          }}
        >
          {options.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  checked={filterValue ? filterValue.includes(option) : false}
                  onChange={() => handleCheckboxChange(option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Filter Function
const multiSelectFilterFn = (rows, columnIds, filterValue) => {
  return rows.filter((row) => (filterValue ? filterValue.includes(row.values[columnIds[0]]) : true));
};

// Register the filter function
multiSelectFilterFn.autoRemove = (val) => !val;

const Table = ({ columns, data, setFilteredRows }) => {
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const enhancedColumns = useMemo(
    () =>
      columns.map((column) => {
        if (column.Header === "Delivery Agent") {
          return {
            ...column,
            Filter: MultiSelectFilter,
            filter: multiSelectFilterFn,
          };
        }
        return column;
      }),
    [columns]
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
      columns: enhancedColumns,
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
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
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
