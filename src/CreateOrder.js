import { useOutletContext } from "react-router-dom";

const CreateOrder = () => {
  const { removeAlert, setDangerAlert, PP: SPs } = useOutletContext();
  console.log({ PP: SPs });

  const orderProducts = [];

  return (
    <div>
      {SPs.map((SP) => {
        return (
          <>
            {SP.name}-----
            {SP.products.map((product) => {
              return (
                <>
                  {product.name}
                  <ul>
                    {product.productPricings.map((pp) => {
                      return (
                        <li>
                          <button>
                            {pp.units} x {pp.totalKilos || "-"} x {pp.pricePerKiloOrUnit || "-"} = {pp.totalPrice}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              );
            })}
            <hr />
          </>
        );
      })}
    </div>
  );
};

export default CreateOrder;
