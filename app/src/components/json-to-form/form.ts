import { ref, reactive } from "vue";

export enum FieldsType {
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  UPLOAD = "upload",
  SELECT = "select",
  DATETIME = "datetime",
}

export enum FieldsStatus {
  ENABLE = 1, // 禁用
  DISABLE = 0, // 启用
}

export interface ValidationOptions {
  type?: string; // 对应form type
  message?: string; // 提示语
  min?: number; // 最小
  max?: number; // 最大
  pattern?: Regexp; // 正则表达式
}

export interface FormFields {
  name: string; // 字段名
  label: string; // 名称
  type: FieldsType; // 类型
  status: FieldsStatus; // 状态
  parentId: number; // 父级
  multiple: boolean; // 是否多选
  required?: boolea; // 是否必填
  disabled?: boolean; // 是否不可编辑
  defValue?: any; // 默认值
  weight?: number; // 权重
  remark?: string; // 备注
  placeholder?: string; //
  title?: string; // 标题
  validation?: ValidationOptions; // 验证格式
  options?: { label: string; value: string }[]; // checkbox，radio 选项
}

export function FormUtls() {
  const formRef = ref();

  const formData = reactive({});
  const formRules = reactive({});

  const getFieldValue = (fields) => {
    const values = {};
    fields.forEach((field) => {
      if (field.type === FieldsType.CHECKBOX) {
        values[field.name] = field.value || [];
      } else {
        values[field.name] = field.value;
      }
    });
    return values;
  };

  const getFieldValidationRules = (fields) => {
    const rulesMap = {};
    fields.forEach((field) => {
      const rules = [];

      if (field.required) {
        rules.push({
          required: true,
          message: `${field.label}不能为空`,
        });
      }

      if (field.validation) {
        if (field.validation.pattern) {
          rules.push({
            type: field.validation.type,
            pattern: field.validation.pattern,
            message: `请输入有效的${field.label}`,
          });
        }
        if (field.validation.min) {
          rules.push({
            min: field.validation.min,
            message: `${field.label}长度不能少于${field.validation.min}个字符`,
          });
        }
        if (field.validation.max) {
          rules.push({
            max: field.validation.max,
            message: `${field.label}长度不能超过${field.validation.max}个字符`,
          });
        }
      }
      rulesMap[field.name] = rules;
    });
    return rulesMap;
  };

  const submitForm = () => {
    formRef.value?.validate((valid) => {
      if (valid) {
        // Form is valid, submit data
        uni.log.info("Form data:", this.formData);
      } else {
        // Form validation failed
        uni.log.info("Form validation failed.");
      }
    });
  };

  const resetForm = () => {
    formRef.value?.resetFields();
  };

  const clearValidate = () => {
    formRef.value?.clearValidate();
  };

  return {
    formRef,
    formData,
    formRules,
    getFieldValidationRules,
    getFieldValue,
    clearValidate,
    resetForm,
    submitForm,
  };
}
