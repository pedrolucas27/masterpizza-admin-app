import React, { useState, useEffect } from "react";
import { Layout, Menu } from 'antd';
import {
  LineChartOutlined,
  FormOutlined,
  OrderedListOutlined,
  BellOutlined,
  UsergroupAddOutlined,
  ShopOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';
const { Sider } = Layout;
const { SubMenu } = Menu;
function MenuSite(props) {
  const [openKeys, setOpenKeys] = useState([]);
  useEffect(() => {
    if(props.openCurrent !== ''){
      setOpenKeys([...openKeys, props.openCurrent]);
    }else{
      setOpenKeys([]);
    }
  }, []);

  const redirect = (path) => {
    window.location.href = path;
  }

  const subMenuChange = (key) => {
    let result = openKeys.includes(key);
    if(result){
      setOpenKeys(openKeys.filter((item) => item !== key));
    }else{
      setOpenKeys([...openKeys, key]);
    }
  }

  return (
    <Sider className="menu" trigger={null} collapsible collapsed={props.open}>
      <div className="logo" />
      <Menu className="menu" mode="inline" selectedKeys={[props.current]} openKeys={openKeys}>
        <Menu.Item className="i-menu" key="dashboard" icon={<LineChartOutlined />} onClick={() => redirect('/dashboard')}>
          Relatório
        </Menu.Item>
        <Menu.Item className="i-menu" key="clients" icon={<UsergroupAddOutlined />}>
          Meus clientes
        </Menu.Item>
        <Menu.Item className="i-menu" key="orders" icon={<BellOutlined />} onClick={() => redirect('/orderTracking')}>
          Pedidos
        </Menu.Item>
        <Menu.Item className="i-menu" key="pdv" icon={<ShopOutlined />} onClick={() => redirect('/pdv')}>
          Pdv
        </Menu.Item>
        <SubMenu className="i-menu" key="register" onTitleClick={() => subMenuChange('register')} icon={<FormOutlined />} title="Cadastros">
          <Menu.Item className="i-menu" key="addProduct" onClick={() => redirect('/addProduct')}>Produto</Menu.Item>
          <Menu.Item className="i-menu" key="addCategory" onClick={() => redirect('/addCategory')}>Categoria</Menu.Item>
          <Menu.Item className="i-menu" key="addFlavor" onClick={() => redirect('/addFlavor')}>Sabor</Menu.Item>
          <Menu.Item className="i-menu" key="addAdditional" onClick={() => redirect('/addAdditional')}>Adiconal</Menu.Item>
          <Menu.Item className="i-menu" key="addCoupom" onClick={() => redirect('/addCoupom')}>Cupom</Menu.Item>
          <Menu.Item className="i-menu" key="addPromotion" onClick={() => redirect('/addPromotion')}>Promoção</Menu.Item>
          <Menu.Item className="i-menu" key="addFormPayment" onClick={() => redirect('/addFormPayment')}>F. de Pagamento</Menu.Item>
        </SubMenu>
        <SubMenu className="i-menu" key="list" onTitleClick={() => subMenuChange('register')} icon={<OrderedListOutlined />} title="Listagens">
          <Menu.Item className="i-menu" key="products" onClick={() => redirect('/products')}>Produtos</Menu.Item>
          <Menu.Item className="i-menu" key="categories" onClick={() => redirect('/categories')}>Categorias</Menu.Item>
          <Menu.Item className="i-menu" key="flavors" onClick={() => redirect('/flavors')}>Sabores</Menu.Item>
          <Menu.Item className="i-menu" key="additionals" onClick={() => redirect('/additionals')}>Adicionais</Menu.Item>
          <Menu.Item className="i-menu" key="coupons" onClick={() => redirect('/coupons')}>Cupons</Menu.Item>
          <Menu.Item className="i-menu" key="promotions" onClick={() => redirect('/promotions')}>Promoções</Menu.Item>
          <Menu.Item className="i-menu" key="formsPayments" onClick={() => redirect('/formsPayments')}>Fs. de Pagamento</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
}
export default MenuSite;