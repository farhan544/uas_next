import { useState,useEffect } from "react";
import axios from "axios";
import { stat } from "fs";

 
 const koneksiBuku = axios.create({
  
  baseURL: "http://127.0.0.1:5000/api/buku" 
});

export default function FormBuku() {
    const [stateisbn, setIsbn] = useState("");
    const [statejudul, setJudul] = useState("");
    const [statetahun, setTahun] = useState("2018-07-22");
    const [statepenulis, setPenulis] = useState("");
    const [statefoto, setFoto] = useState("");
    const [buku, setBuku] =  useState(null);
    const [stateadd,setAdd]=useState("hide");
    const [statebutonadd,setbtnAdd]=useState("show");
    const [stateedit,setEdit]=useState("hide");
    
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
  }
  
  const handleSubmitAdd = (event) => {
    
    event.preventDefault();
    const formData = new FormData(event.target);
    koneksiBuku
      .post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
     
 }
 const handleSubmitEdit =  (event) => {
    
  event.preventDefault();
  const address = "/"+event.target.isbn.value;
  alert(address);
  //const formData = new FormData(event.target);
  const formData = {
    isbn: event.target.isbn.value,
    judul: event.target.judul.value,
    tahun_terbit: event.target.tahun_terbit.value,
    penulis: event.target.penulis.value

}
  alert(formData);
  koneksiBuku
    .put( address,formData)
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
   
}
  const handleAdd = (event) => {
    
     setAdd("show");
     setbtnAdd("hide");
     setEdit("hide");
 
      
  }
  const handleCancelAdd = (event) => {
    
     setAdd("hide");
     setbtnAdd("show");
     setEdit("hide");
 
      
  }
  const handleCancelEdit = (event) => {
    
    setAdd("hide");
    setbtnAdd("show");
    setEdit("hide");
    setIsbn("");
    setJudul("");
    setTahun(formatDate("2018-07-22"));
    setPenulis("");
    setFoto("");
     
 }
   const handleDelete = (event) => {
            event.preventDefault();
            var isbn = event.target.value;
            koneksiBuku.delete(`/${isbn}`)
              .then(response => {
                console.log('Data berhasil dihapus:', response.data);
                setBuku(
                  buku.filter((buku) => {
                     return buku.isbn !== isbn;
                  }))
             
                // Lakukan langkah-langkah lain setelah penghapusan data
              })
              .catch(error => {
                console.error('Gagal menghapus data:', error);
              })
          }

      const handleEdit = (event) => {
            event.preventDefault();
            var isbn = event.target.value;
            
               const bkEdit = buku.filter((buku) => {
                     return buku.isbn == isbn;
                  });
                  if(bkEdit!=null){

                    setIsbn(bkEdit[0].isbn);
                    setJudul(bkEdit[0].judul);
                    setTahun(formatDate(bkEdit[0].tahun_terbit));
                    setPenulis(bkEdit[0].penulis);
                    setFoto(bkEdit[0].foto);
                    setAdd("hide");
                    setbtnAdd("hide");
                    setEdit("show");

                  }
          }
  useEffect(() => {
      async function getBuku() {
        const response = await koneksiBuku.get("/").then(function (axiosResponse) {
            setBuku(axiosResponse.data.data); 
     
         })
         .catch(function (error) {   
          alert('error from buku in api buku: '+error);
         });;
          }
      getBuku();
    }, []);
  
   
if(buku==null){
return(
  <div>
    waiting...
  </div>
)
}else{

  return (
   <center><div>
    <br></br><h1>DATA BUKU</h1><br></br>
       <form id="formadd" className={stateadd} onSubmit={handleSubmitAdd} >
       <br/><h3>TAMBAH DATA BUKU</h3><br/>
        <table border={0}>
            <tbody>
            <tr>
            <td> <label> ISBN:</label></td>
            <td><input type="text" id="isbn" name="isbn"/>
              
              </td>
        </tr>
        <tr>
            <td>  <label> Judul:</label></td>
            <td><input type="text" id="judul"   name="judul" 
               /></td>
        </tr>
        <tr>
            <td>  <label> Tahun Terbit:</label></td>
            <td>  <input type="date" name="tahun_terbit"
           min="1970-01-01" max="2023-12-31"/>
     </td>
        </tr>
        <tr>
            <td>  <label> Penulis:</label></td>
            <td><input type="text" id="penulis"   name="penulis" 
               /></td>
        </tr>
        <tr>
            <td>  <label> Foto:</label></td>
            <td>   <input
                    type="file" name="image"/>  </td>
        </tr>
        
            </tbody>
          </table>
          <br/>
          <input type="submit"/> | <input type="button" value="Cancel" onClick={handleCancelAdd} /><br/><br/>
          </form>  

      <form id="formedit" className={stateedit} onSubmit={handleSubmitEdit}>
      <br/><h3>EDIT DATA BUKU</h3><br/>
          <table border={0}>
            <tbody>
            <tr>
            <td> <label> ISBN:</label></td>
            <td><input type="text" id="isbn"  value={stateisbn} name="isbn"/>
              {/* onChange={handleOnchangeNim}  /> */}
              </td>
        </tr>
        <tr>
            <td>  <label> Judul:</label></td>
            <td><input type="text" id="judul"  value={statejudul} name="judul"
               onChange={(e) => setJudul(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> Tahun Terbit:</label></td>
            <td>  <input type="date" value={statetahun} name="tahun"  onChange={(e) => setTahun(e.target.value)}
           min="1970-01-01" max="2023-12-31"/>
     </td>
        </tr>
        <tr>
            <td>  <label> Penulis:</label></td>
            <td><input type="text" id="penulis"  value={statepenulis} name="penulis"
               onChange={(e) => setPenulis(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> Foto:</label></td>
            <td>  <img src={statefoto} width="80"/> </td>
        </tr>
        
            </tbody>
          </table>
          <br/><input type="submit" /> | <input type="button" value="Cancel" onClick={handleCancelEdit} /><br/><br/>
          </form>  
          <br></br>
        <button id="btnadd" onClick={handleAdd} className={statebutonadd} style={{color: "white", backgroundColor: "rgb(46, 100, 32)", borderWidth: "0.5px", padding: "5px", borderSpacing: "0", borderRadius: "3px", cursor: "pointer"}}>
          Tambah Data</button>
        <br></br><br></br>
            Tabel Data Buku hasil get Local Nodejs 
        <table border={4}>
            <thead>
                <tr style={{backgroundColor:"green", color:"white"}}>
                <td>ISBN</td> 
                <td>Judul</td>
                <td>Tahun Terbit</td>
                <td>Penulis</td>
                <td>Foto</td>
                <td colSpan={2}>Opsi</td>
                </tr>
            </thead>
            <tbody>
            {buku.map((bk) => 
                <tr className="tr-isi">
                    <td>{bk.isbn}</td>
                    <td>{bk.judul}</td>
                    <td>{bk.tahun_terbit}</td>
                    <td>{bk.penulis}</td>
                    <td><img src={bk.foto} width="80"/></td>
                   <td><button className="tomboledit" onClick={handleEdit} value={bk.isbn}>Edit</button> | <button className="tombolhapus" onClick={handleDelete} value={bk.isbn}> Delete</button></td>
                </tr>
           )}     
                   </tbody>
          </table>
          <br></br>
          <br></br><br></br>
         
          </div></center>
        )
}
  
  }