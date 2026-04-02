import Button from "./Button";

const Pagination = ({ page, setPage, pageSize, total }) => {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="flex gap-3">
      <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
        <img
          src="/icons/arrow-right.svg"
          alt="arrow-left"
          className="rotate-180"
        />
      </Button>
      {[page - 2, page - 1, page, page + 1, page + 2].map(
        (i) =>
          i > 0 &&
          i <= totalPages && (
            <Button
              color={i !== page && "fade"}
              key={i}
              onClick={() => setPage(i)}
            >
              {i}
            </Button>
          ),
      )}

      <Button
        disabled={page === totalPages}
        onClick={() => setPage((prev) => prev + 1)}
      >
        <img src="/icons/arrow-right.svg" alt="arrow right" />
      </Button>
    </div>
  );
};

export default Pagination;
