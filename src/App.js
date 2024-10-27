import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "./components/Alert";
import { useEffect, useState } from "react";
import { capitalize } from "./utils/string";

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [jwt, setJwt] = useState("");
  const [SPs, setSPs] = useState([]);
  const users = [
    {
      _id: "6719685567199e74865a0b60",
      phone: "011558711111",
      password: "$2b$10$ZP8AVJ5nWls581l0ouEiIeoKInTbUqvHkFXLYEzioODKngl4YQW8G",
      name: "hema Fawzy",
      address: "my address",
      isVerified: false,
      type: "buyer",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cad",
      name: "ْA.3l العنوان ش عبد السلام عارف ع ناصيته قهوه كحله ومقله شيخ العرب عماره",
      phone: "+201004612989",
      address: "ْA.3l العنوان ش عبد السلام عارف ع ناصيته قهوه كحله ومقله شيخ العرب عماره",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cae",
      name: "A//mohamed Yassen",
      phone: "01002499086",
      address: "A//mohamed Yassen",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8caf",
      name: "A/hesham",
      phone: "01099600812",
      address: "A/hesham",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb0",
      name: "A/m.taw7ed",
      phone: "01000554747",
      address: "A/m.taw7ed",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb1",
      name: "A Elhlw",
      phone: "01067450263",
      address: "A Elhlw",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb2",
      name: "A7med Rs",
      phone: "01125177722",
      address: "A7med Rs",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb3",
      name: "A7med Telbana",
      phone: "+201203920315",
      address: "A7med Telbana",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb4",
      name: "Abaas Awad  دور خامس العنوان كليه اداب برج النور اعلى ريماس لاند",
      phone: "+201274868181",
      address: "Abaas Awad  دور خامس العنوان كليه اداب برج النور اعلى ريماس لاند",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb5",
      name: "om طلخا يمين الكوبري شارع النوادي برج نوران اعلى مستشفى الهدى مقابل نادي",
      phone: "+201018939263",
      address: "om طلخا يمين الكوبري شارع النوادي برج نوران اعلى مستشفى الهدى مقابل نادي",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb6",
      name: "Samay Abdalaziz شارع10عند قهوه الصعايده القديمه برج الخلود2 دور سابع",
      phone: "+201061692335",
      address: "Samay Abdalaziz شارع10عند قهوه الصعايده القديمه برج الخلود2 دور سابع",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb7",
      name: "Abdallah Amr",
      phone: "01060450868",
      address: "Abdallah Amr",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb8",
      name: "Abdallah El Mahdy",
      phone: "01007744641",
      address: "Abdallah El Mahdy",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cb9",
      name: "abdallah elkholy52 ٥٥ ش نور الإسلام آخر توريل الجديده على  ناصية الشارع",
      phone: "+201200047917",
      address: "abdallah elkholy52 ٥٥ ش نور الإسلام آخر توريل الجديده على  ناصية الشارع",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cba",
      name: "Samia قناة السويس خلف مستشفى الخير عند أسماك السندباد Abdel-Majid",
      phone: "+201011238116",
      address: "Samia قناة السويس خلف مستشفى الخير عند أسماك السندباد Abdel-Majid",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cbb",
      name: "Mona ش قناه السويس عند جامع الايمان بعده فى محل اسمه كراميل للألبان انا",
      phone: "+201008938195",
      address: "Mona ش قناه السويس عند جامع الايمان بعده فى محل اسمه كراميل للألبان انا",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cbc",
      name: "Omar مدينة مبارك الشارع عند البارون Abdelfattah او استلام",
      phone: "+201019771094",
      address: "Omar مدينة مبارك الشارع عند البارون Abdelfattah او استلام",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cbd",
      name: "Randa السلام عليكم لو سمحت انا عاوزه ٥بطيخات اللى سعرها ٢٥ بكره  العنوان",
      phone: "+201060595152",
      address: "Randa السلام عليكم لو سمحت انا عاوزه ٥بطيخات اللى سعرها ٢٥ بكره  العنوان",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cbe",
      name: "Mohamedاستلام Abdelhady",
      phone: "+201156020560",
      address: "Mohamedاستلام Abdelhady",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cbf",
      name: "Dr شارع احمد ماهر.تقسيم ٦ اكتوبر خلف جامع ٦ اكتوبر بجوار عيادة فلامنجو G",
      phone: "+201095604055",
      address: "Dr شارع احمد ماهر.تقسيم ٦ اكتوبر خلف جامع ٦ اكتوبر بجوار عيادة فلامنجو G",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc0",
      name: "Eng أمام مجمع الفردوس بالمجزر Mohamed Abdellatef",
      phone: "+201157822652",
      address: "Eng أمام مجمع الفردوس بالمجزر Mohamed Abdellatef",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc1",
      name: "Seham تقسيم خطاب ش٤ بجوار الوكاله عماره ٧٦ Abdellatif",
      phone: "+201006553596",
      address: "Seham تقسيم خطاب ش٤ بجوار الوكاله عماره ٧٦ Abdellatif",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc2",
      name: "Huda طلخا  السوق التحتانى جامع أبو غربية أمام الجامع شارع أبو غربية الشا",
      phone: "+201099835042",
      address: "Huda طلخا  السوق التحتانى جامع أبو غربية أمام الجامع شارع أبو غربية الشا",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc3",
      name: "Sahar العنوان شارع جيهان.حي الجامعه.برج المثلث.اعلي we.للاتصالات.امام مس",
      phone: "+201003430167",
      address: "Sahar العنوان شارع جيهان.حي الجامعه.برج المثلث.اعلي we.للاتصالات.امام مس",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc4",
      name: "Hoda ٢٢ شارع منتصر برج مكه أمام مكتبه الحضري الدور التاني علوي باب الشقه",
      phone: "+201060239337",
      address: "Hoda ٢٢ شارع منتصر برج مكه أمام مكتبه الحضري الدور التاني علوي باب الشقه",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc5",
      name: "Mohammedقناه السويس عند شعبان للملابس Abdo",
      phone: "+201032798815",
      address: "Mohammedقناه السويس عند شعبان للملابس Abdo",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc6",
      name: "Abdo Qasem",
      phone: "01001785340",
      address: "Abdo Qasem",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc7",
      name: "Abdo80@yahoo.com",
      phone: "+201007329500",
      address: "Abdo80@yahoo.com",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc8",
      name: "Abdul Rahman Salem",
      phone: "+201033886519",
      address: "Abdul Rahman Salem",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cc9",
      name: "Om ش الترعة برج زهرة المدائن أعلى صيدلية الصيدلى الدور السادس الحاجة أم",
      phone: "+201013276623",
      address: "Om ش الترعة برج زهرة المدائن أعلى صيدلية الصيدلى الدور السادس الحاجة أم",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cca",
      name: "Abeer Mohamed",
      phone: "01091538603",
      address: "Abeer Mohamed",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8ccb",
      name: "Abla Zakia",
      phone: "٠١٠٦١٩٣١٧٨٦",
      address: "Abla Zakia",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8ccc",
      name: "Abo 5lil",
      phone: "01000300440",
      address: "Abo 5lil",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8ccd",
      name: "Abo 5lil 3abdo",
      phone: "01004763654",
      address: "Abo 5lil 3abdo",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cce",
      name: "Abo 5lil Dubai",
      phone: "+971582608000",
      address: "Abo 5lil Dubai",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8ccf",
      name: "Abo 5lil Dubaiiiii",
      phone: "+971557015031",
      address: "Abo 5lil Dubaiiiii",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cd0",
      name: "Abo 5lil UAE",
      phone: "+971559392535",
      address: "Abo 5lil UAE",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cd1",
      name: "Abo 5lil's Mom",
      phone: "01000941085",
      address: "Abo 5lil's Mom",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cd2",
      name: "Abo Jo",
      phone: "01142494946",
      address: "Abo Jo",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cd3",
      name: "Abo Lila",
      phone: "01099369999",
      address: "Abo Lila",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cd4",
      name: "Abo Malak♥️",
      phone: "01064082297",
      address: "Abo Malak♥️",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cd5",
      name: "Shrif شارع الجمهوريه امام كليه الحقوق أعلى بن الفيومى الدور الحادى عشر ش",
      phone: "+201019560060",
      address: "Shrif شارع الجمهوريه امام كليه الحقوق أعلى بن الفيومى الدور الحادى عشر ش",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
  ];

  const deliveryAgents = [
    {
      _id: "6719685567199e74865a0b60",
      phone: "011558711111",
      password: "$2b$10$ZP8AVJ5nWls581l0ouEiIeoKInTbUqvHkFXLYEzioODKngl4YQW8G",
      name: "hema Fawzy",
      address: "my address",
      isVerified: false,
      type: "buyer",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cad",
      name: "ْA.3l العنوان ش عبد السلام عارف ع ناصيته قهوه كحله ومقله شيخ العرب عماره",
      phone: "+201004612989",
      address: "ْA.3l العنوان ش عبد السلام عارف ع ناصيته قهوه كحله ومقله شيخ العرب عماره",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
    {
      _id: "67196867b48bf78d908a8cae",
      name: "A//mohamed Yassen",
      phone: "01002499086",
      address: "A//mohamed Yassen",
      type: "buyer",
      isVerified: false,
      notes: "",
      __v: 0,
    },
  ];

  const data = [
    {
      _id: "67142a5aa2bbf786361ac6e0",
      name: "tomato11",
      products: [
        {
          _id: "67142457eddb40082f621eee",
          name: "tomato",
          productPricings: [
            {
              _id: "671430ea13d8f8c1db9f7af7",
              units: 1,
              totalKilos: 10,
              pricePerKiloOrUnit: 10,
              totalPrice: 100,
            },
            {
              _id: "6714310b3bdd2502ed1339c1",
              units: 5,
              totalKilos: null,
              pricePerKiloOrUnit: 10,
              totalPrice: 50,
            },
            {
              _id: "671433a3d417427c1c0157f6",
              units: 5,
              totalKilos: null,
              pricePerKiloOrUnit: 10,
              totalPrice: 50,
            },
            {
              _id: "671433bcd417427c1c0157f8",
              units: 5,
              totalKilos: null,
              pricePerKiloOrUnit: 10,
              totalPrice: 50,
            },
            {
              _id: "671433cdd417427c1c0157fa",
              units: 5,
              totalKilos: 20,
              pricePerKiloOrUnit: 10,
              totalPrice: 200,
            },
            {
              _id: "671433f59f7b09a23ef920be",
              units: 5,
              totalKilos: null,
              pricePerKiloOrUnit: null,
              totalPrice: 40,
            },
            {
              _id: "6714341c9f7b09a23ef920c0",
              units: 5,
              totalKilos: 20,
              pricePerKiloOrUnit: 10,
              totalPrice: 200,
            },
            {
              _id: "6717b858a528378a79c4dd61",
              units: 5,
              totalKilos: 50,
              pricePerKiloOrUnit: 10,
              totalPrice: 500,
            },
            {
              _id: "6717b868a528378a79c4dd64",
              units: 15,
              totalKilos: null,
              pricePerKiloOrUnit: 15,
              totalPrice: 225,
            },
            {
              _id: "6717b880a528378a79c4dd67",
              units: 15,
              totalKilos: 200,
              pricePerKiloOrUnit: 0,
              totalPrice: 100,
            },
          ],
        },
      ],
    },
    {
      _id: "6717ade51904dbe4c7f123a2",
      name: "mango123",
      products: [
        {
          _id: "6717b1431a4b99d9b263069b",
          name: "my prod",
          productPricings: [
            {
              _id: "6717b68803c22d54c1f2a721",
              units: 5,
              totalKilos: 10,
              pricePerKiloOrUnit: 15,
              totalPrice: 150,
            },
          ],
        },
      ],
    },
    {
      _id: "6717f781675c224683a565cc",
      name: "btngan",
      products: [
        {
          _id: "6717f78d675c224683a565d3",
          name: "bntgan fa5r",
          productPricings: [
            {
              _id: "6717f7bd675c224683a565e5",
              units: 1,
              totalKilos: 10,
              pricePerKiloOrUnit: 5,
              totalPrice: 50,
            },
            {
              _id: "6717f7ca675c224683a565e8",
              units: 1,
              totalKilos: 3,
              pricePerKiloOrUnit: 0,
              totalPrice: 55,
            },
            {
              _id: "6717f80d675c224683a565eb",
              units: 1,
              totalKilos: 10,
              pricePerKiloOrUnit: 0,
              totalPrice: 125,
            },
          ],
        },
      ],
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined") {
        setJwt(token);
      } else {
        navigate("/login");
      }
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const fetchPP = async () => {
      try {
        const response = await fetch("http://localhost:5000/product-pricings", { method: "GET" });
        const data = await response.json();

        setSPs(data);
      } catch (error) {
        setDangerAlert("couldn't fetch product pricing");
      }
    };

    fetchPP();
  }, []);

  const login = (jwt) => {
    setJwt(jwt);
    localStorage.setItem("token", jwt);
    navigate("/");
  };

  const logout = () => {
    setJwt("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const removeAlert = () => {
    setAlertMessage("");
    setAlertClassName("d-none");
  };

  const setDangerAlert = (message) => {
    setAlertMessage(capitalize(message));
    setAlertClassName("alert-danger");
  };

  return (
    <div className="container">
      <Alert className={alertClassName} message={alertMessage} />
      <div className="row">
        <div className="col">
          <h1 className="mt-3 text-center">Delivery Souq Gomla</h1>
        </div>
        <div className="col text-end">
          {jwt ? (
            <a href="#!">
              <span onClick={logout} className="badge bg-danger">
                logout
              </span>
            </a>
          ) : (
            <Link to="/login">
              <span className="badge bg-success">login</span>
            </Link>
          )}
        </div>
        <hr className="mb-3"></hr>
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              {jwt && (
                <>
                  <Link to="/" className="list-group-item list-group-item-action">
                    Home
                  </Link>
                  <Link to="/orders" className="list-group-item list-group-item-action">
                    Orders
                  </Link>
                  <Link to="/create-order" className="list-group-item list-group-item-action">
                    Create Order
                  </Link>

                  <Link to="/sps" className="list-group-item list-group-item-action">
                    Standard Products
                  </Link>
                  <Link to="/users" className="list-group-item list-group-item-action">
                    users
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
        <div className="col-md-10">
          <Outlet
            context={{
              removeAlert,
              setDangerAlert,
              login,
              PP: SPs,
              users,
              data,
              deliveryAgents,
              jwt,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
