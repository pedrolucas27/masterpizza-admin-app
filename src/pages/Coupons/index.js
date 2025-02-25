import React, { useState, useEffect } from "react";
import API from "../../api.js";
import { 
	maskNumer, 
	getStorageERP, 
	isLoggedAdmin 
} from "../../helpers.js";
import {
	Layout,
	Button,
	Form,
	Switch,
	Input,
	Row,
	Col,
	Table,
	Tooltip,
	Drawer,
	message,
	Popconfirm,
	Spin,
	Typography
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
const { Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;
function Coupons() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [idUpdate, setIdUpdate] = useState(null);
	const [form] = Form.useForm();
	const [dataCoupons, setDataCoupons] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		getCoupons();
		setLoading(false);
	}, []);


	const columns = [
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
		{ title: 'Descrição', dataIndex: 'description', key: 'description' },
		{
			title: 'Desconto (%)',
			dataIndex: 'discount_percentage',
			key: 'discount_percentage',
			render: (__, record) => {
				return (
					<div>
						{record.discount_percentage}
					</div>
				);
			}
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (__, record) => {
				return (
					<div>
						{ record.status ? "Ativo" : "Inativo"}
					</div>
				);
			}
		},
		{
			title: 'Ações',
			dataIndex: '',
			key: 'x',
			render: (__, record) => {
				return (
					<div>
						<Tooltip placement="top" title='Deletar cupom'>
							<Popconfirm
								 title="Tem certeza que deseja deletar ?"
								 onConfirm={() => deleteCoupom(record.key)}
								 okText="Sim"
								 cancelText="Não"
							 >
								<DeleteOutlined className="icon-table" />
							</Popconfirm>
						</Tooltip>
						<Tooltip placement="top" title='Editar cupom'>
							<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];


	const getCoupons = async () => {
		try {
			API.get("coupom/" + idEstablishment).then((response) => {
				let array = [];
				response.data.forEach((coupom) => {
					array.push({
						key: coupom.id_coupom,
						code: coupom.code,
						name: coupom.name_coupom,
						description: coupom.description || "-",
						discount_percentage: coupom.discount_percentage,
						status: coupom.is_active
					})
				})
				setDataCoupons(array);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const deleteCoupom = async (id) => {
		try {
			setLoading(true);
			API.delete("coupom/" + id + "/" + idEstablishment).then(response => {
				if (response.status === 200) {
					getCoupons();
					setLoading(false);
					message.success(response.data.message);
				} else {
					setLoading(false);
					message.error(response.data.message);
				}
			}).catch(error => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente!");
		}
	}

	const updateCoupom = async (values) => {
		setLoading(true);
		try {
			if (values.name_coupom && Number(values.discount_percentage) !== 0) {
				const response = await API.put("coupom",
					{
						id_coupom: idUpdate,
						name_coupom: values.name_coupom,
						description: values.description,
						discount_percentage: Number(values.discount_percentage),
						is_active: values.is_active,
						id_company: idEstablishment
					}
				);
				setLoading(false);
				if (response.status === 200) {
					getCoupons();
					message.success(response.data.message);
					setExpandEditRow(!expandEditRow);
				} else {
					message.error(response.data.message);
				}
			} else {
				setLoading(false);
				message.error("Informe os campos pedidos, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente!");
		}

	}

	const setFildsDrawer = (id) => {
		const line = dataCoupons.filter((item) => item.key === id)[0];
		setIdUpdate(id);
		form.setFieldsValue({
			name_coupom: line.name,
			discount_percentage: maskNumer(line.discount_percentage),
			is_active: line.status,
			description: line.description
		});
		setExpandEditRow(!expandEditRow);
	}

	const handleChangePercentage = async () => {
		const field = form.getFieldValue("discount_percentage");
		if(Number(field) < 100){
			form.setFieldsValue({ discount_percentage: await maskNumer(field) });
		}else{
			form.setFieldsValue({ discount_percentage: '' });
		}
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout className="container-body">
					<MenuSite onTitle={!expand} open={expand} current={'coupons'} openCurrent={'list'} />
					<Layout>
						<HeaderSite title={'Listagem de cupons'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Table
								size="middle"
								columns={columns}
								dataSource={dataCoupons}
								locale={{ 
									emptyText: (
										<Title level={4} style={{ margin: 30 }}>Não existe cupons cadastrados.</Title>
									)
								}}
							/>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>
				<Drawer
					title="Editar cupom"
					width={720}
					onClose={() => setExpandEditRow(!expandEditRow)}
					visible={expandEditRow}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" form={form} onFinish={updateCoupom}>
						<Row gutter={[8, 0]}>
							<Col span={16}>
								<Form.Item label="Nome" name="name_coupom">
									<Input className="input-radius" />
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Porcentagem de desconto (%)" name="discount_percentage">
									<Input className="input-radius" onKeyUp={handleChangePercentage} />
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Status" name="is_active" valuePropName="checked">
									<Switch />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="Descrição" name="description">
									<TextArea rows={4} className="input-radius" />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Button onClick={() => form.submit()} shape="round" className="button ac">
									Editar
							    </Button>
								<Button onClick={() => { form.resetFields() }} shape="round" className="button-cancel ac">
									Cancelar
							    </Button>
							</Col>
						</Row>
					</Form>
				</Drawer>
			</Spin>
		</div>
	);
}
export default Coupons;
