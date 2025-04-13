import { FC, useState } from 'react';
import './styles.scss';
import editIcon from '/edit.svg';

const initialParams: Param[] = [
	{
		id: 1,
		name: 'Наименование',
		type: 'string',
	},
	{
		id: 2,
		name: 'Назначение',
		type: 'string',
	},
	{
		id: 3,
		name: 'Длина',
		type: 'string',
	},
	{
		id: 4,
		name: 'Ширина',
		type: 'number',
	},
	{
		id: 5,
		name: 'Рейтинг',
		type: 'number',
	},
];

const initialModel: Model = {
	paramValues: [
		{ paramId: 1, value: 'Брюки' },
		{ paramId: 2, value: 'Casual' },
		{ paramId: 3, value: 'Oversize' },
	],
};

type ValueType = string | number;
interface Param {
	id: number;
	name: string;
	type: string;
}
interface ParamValue {
	paramId: number;
	value: ValueType;
}
interface Model {
	paramValues: ParamValue[];
}
interface ParameterProps {
	param: Param;
	model: ParamValue;
	onBlur: (value: ValueType) => void;
}

const EditModel: FC<ParameterProps> = ({ param, model, onBlur }) => {
	const [value, setValue] = useState(model?.value || '');
	return (
		<div className="comp-container">
			<label htmlFor={String(param.id)}>{param.name}</label>
			<input
				type={param.type}
				id={String(param.id)}
				value={value}
				placeholder="введите значение"
				onChange={(e) => setValue(e.target.value)}
				onBlur={() => onBlur(value)}
			/>
		</div>
	);
};

interface Props {
	id: number;
	params: Param[];
	model: Model;
	remove: (id: number) => void;
}

const Component: FC<Props> = ({ id: idItem, model, params, remove }) => {
	const [models, setModels] = useState(model.paramValues);
	const [isEdit, setIsEdit] = useState(false);

	const updateModels = (id: number, value: ValueType) => {
		const index = models.findIndex((m) => m.paramId === id);

		if (index === -1) {
			setModels((prev) => [...prev, { paramId: id, value }]);
		} else {
			setModels((prev) =>
				prev.map((m) => (m.paramId === id ? { ...m, value } : m)),
			);
		}
	};

	const toggleEdit = () => {
		setIsEdit((prev) => !prev);
	};

	return isEdit ? (
		<div className="item">
			{params.map((p) => {
				const currentModel = models.find((m) => m.paramId === p.id)!;

				return (
					<EditModel
						key={p.id}
						param={p}
						model={currentModel}
						onBlur={(val) => updateModels(p.id, val)}
					/>
				);
			})}
			<div className="space" />
			<button onClick={toggleEdit}>Save</button>
		</div>
	) : (
		<div className="item">
			{params.map((p) => (
				<div key={p.id}>
					{p.name}:{' '}
					<strong>
						{models.find((m) => m.paramId === p.id)?.value || '–'}
					</strong>
				</div>
			))}
			<div className="space" />
			<img
				src={editIcon}
				alt="edit"
				className="edit"
				onClick={toggleEdit}
			/>
			<button className="remove-btn" onClick={() => remove(idItem)}>
				&times;
			</button>
		</div>
	);
};

interface Item {
	id: number;
	model: Model;
}

export const App = () => {
	const [items, setItems] = useState<Item[]>([
		{ id: 1, model: initialModel },
	]);

	const newItem = () => {
		setItems((prev) => [
			...prev,
			{
				id: Date.now(),
				model: {
					paramValues: initialParams.map((p) => ({
						paramId: p.id,
						value: '',
					})),
				},
			},
		]);
	};

	const removeItem = (id: number) => {
		setItems((prev) => prev.filter((i) => i.id !== id));
	};

	return (
		<>
			<h2>Добавление и редактирование элемента</h2>
			<div className="grid">
				<div className="new-item" onClick={newItem}>
					+
				</div>
				{items.map(({ model, id }) => (
					<Component
						key={id}
						params={initialParams}
						remove={removeItem}
						{...{ model, id }}
					/>
				))}
			</div>
		</>
	);
};

export default App;
