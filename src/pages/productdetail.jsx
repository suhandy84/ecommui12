import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../supports/ApiUrl';
import {changetoRupiah} from './../supports/changeToRp'
import {connect} from 'react-redux'
import {Modal,ModalBody,ModalFooter} from 'reactstrap'
import {Redirect} from 'react-router-dom'

const ProductDetail =(props)=>{

    const [data,setdata]=useState({})
    const [qty,setqty]=useState(1)
    const [modalopen,setmodalopen]=useState(false)
    const [redirectlog,setredirectlog]=useState(false)

    useEffect(()=>{//sama dengan didmount
        Axios.get(`${API_URL}/products/${props.match.params.idprod}`)
        .then((res)=>{
            console.log(res.data)
            setdata(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])
    
    const qtychange=(e)=>{
        if(e.target.value===''){
            setqty(0)
        }
        if(Number(e.target.value)){
            if(qty===0){
                setqty( e.target.value[1])
            }else{
                if(e.target.value>stok){//jika valuenya lebih besar maka qtynya akan maksimal
                    setqty(stok)
                }else if(e.target.value<1){
                    setqty(1)
                }
                else{
                    // console.log(e.target.defaultValue)
                    setqty(e.target.value)
                }
            }
        }
    }
    const sendToCart=()=>{
        if(props.User.islogin&&props.User.role==='user'){

        }else{
            setmodalopen(true)
        }
    }
    const onToLoginClick=()=>{
        if(props.User.role==='admin'){
            setmodalopen(false)
        }else{
            setmodalopen(false)
            setredirectlog(true)
        }

    }
    const {name,image,seen,stok,harga}=data
    if(redirectlog){
        return <Redirect to='/login'/>
    }
    if(data){
        return(
            <div className='paddingatas'>
                <Modal centered toggle={()=>setmodalopen(false)} isOpen={modalopen}>
                    <ModalBody>
                        {
                            props.User.role==='admin'?
                            'maaf anda admin'
                            :
                            'Maaf Anda harus login dahulu'
                        }
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-primary' onClick={onToLoginClick}>OK</button>
                    </ModalFooter>
                </Modal>
                <div className="row">
                    <div className="col-md-4 p-2">
                        <div className="product-detail">
                            <img src={image} alt={name} width='100%' className='rounded'/>
                        </div>
                    </div>
                    <div className="col-md-8 p-2">
                        <div className='border-headerdetail'>
                            <div className='font-weight-bolder font-nameprod'>
                                {name}
                            </div>
                            <div className='font-typographysmall'>
                                <span className='font-weight-bold'>{0}&nbsp;X</span> dibeli
                            </div>
                        </div>
                        <div className='border-headerdetail' style={{lineHeight:'80px'}}>
                            <div className="row">
                                <div className="col-md-1 font-typographymed">
                                   Stok
                                </div>
                                <div className="col-md-11">
                                    {stok}pcs
                                </div>
                            </div>
                        </div>
                        <div className=' border-headerdetail' style={{lineHeight:'80px'}}>
                            <div className="row" style={{verticalAlign:'center'}}>
                                <div className="col-md-1 font-typographymed" >
                                   Harga
                                </div>
                                <div className="col-md-11 font-harga">
                                    {changetoRupiah(harga*qty)}
                                </div>                               
                            </div>
                        </div>
                        <div className=' border-headerdetail' >
                            <div className="row" >
                                <div className="col-md-1 font-typographymed py-3">
                                   Jumlah
                                </div>
                                <div className="col-md-11 d-flex py-2">
                                    <button className='btn btn-primary' disabled={qty<=1?true:false} onClick={()=>setqty(qty-1)}>-</button>
                                    <div className='rounded' style={{border:'1px black solid'}} >
                                        <input 
                                            type="text" 
                                            style={{width:'100px',height:'60px',textAlign:'center',backgroundColor:'transparent',border:'0px'}} 
                                            value={qty} 
                                            onChange={qtychange}
                                        />
                                    </div>
                                    <button className='btn btn-primary' disabled={qty>=stok?true:false} onClick={()=>setqty(parseInt(qty)+1)}>+</button>
                                </div>
                            </div>
                        </div>
                        <div className=' border-headerdetail' style={{lineHeight:'80px'}}>
                            <button className='btn btn-success' onClick={sendToCart}>Beli</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return <div className='paddingatas'>loadingg...</div>
}
const MapstatetoProps=(state)=>{
    return{
        User:state.Auth
    }
}

export default connect(MapstatetoProps) (ProductDetail);