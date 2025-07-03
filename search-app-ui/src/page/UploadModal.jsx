import { Button, Col, Form, Input, Layout, Modal, Radio, Row, Select, Tag, Upload } from "antd"
import { useDispatch, useSelector } from "react-redux";
import { searchPageActions } from "../data/searching";
import axios from "axios";
import { useEffect, useState } from "react";
import { message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const {TextArea} = Input;

function UploadModal() {

    const { isModalVisible, accessList } = useSelector(state=>state.search);
    const dispatch = useDispatch();
    const [uploadType, setUploadType] = useState(null);
    const [link, setLink] = useState("");
    const [fileName, setFileName] = useState("");
    const [form] = Form.useForm();
    const [tags, setTags] = useState([]);

    const handleCancel = () =>{
        dispatch(searchPageActions.closeModal());
        form.resetFields();
        setUploadType(null); 
        setLink("");
        setTags([]);     
        setInput(""); 
    }
   const uploadProps = {
    beforeUpload: (file) => {
      console.log("Selected file:", file);
      form.setFieldsValue({ name: file.name }); 
      return false; 
    },
 };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      if (
        uploadType === "file" &&
        values.uploadFile &&
        Array.isArray(values.uploadFile) &&
        values.uploadFile[0] &&
        values.uploadFile[0].originFileObj
      ) {
        formData.append('fileUpload', values.uploadFile[0].originFileObj);
      }
      if (uploadType === "link") {
        formData.append('link', link);
      }
      formData.append('title', values.name || '');
      formData.append('description', values.description || '');
      formData.append('tags', tags.join(','));
      formData.append('access_group', values.access_groups || '');
      formData.append('category', values.category || '');
      formData.append('contact', values.email || '');

      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.file_reference) {
        message.success({
          content: `File Reference: ${response.data.file_reference}`,
          duration: 5
        });
      } else {
        message.success({
          content: 'Upload successful!',
          duration: 3
        });
      }
      dispatch(searchPageActions.closeModal());
      form.resetFields();
      setUploadType(null);
      setLink("");
      setTags([]);
    } catch (err) {
      message.error({
        content: 'Upload failed! Please try again.',
        duration: 4
      });
      console.log("Validation or upload failed:", err);
    }
  };

    const categoryList=[
    "Doc",
    "Application",
    "Project",
    "Link"
  ]


   useEffect(() => {
    dispatch(searchPageActions.getAccess());
  }, [dispatch]);

   const [input, setInput] = useState("");
   const [tagSuggestions, setTagSuggestions] = useState([]);

   useEffect(() => {
     // Fetch tag suggestions from API
     axios.get('http://localhost:8000/all_tags/')
       .then(res => {
         if (Array.isArray(res.data)) {
           setTagSuggestions(res.data);
         } else if (res.data && Array.isArray(res.data.tags)) {
           setTagSuggestions(res.data.tags);
         }
       })
       .catch(() => setTagSuggestions([]));
   }, []);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault(); 
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (removedTag) => {
    setTags(tags.filter(tag => tag !== removedTag));
  };

    return(
        <Modal open={isModalVisible}
        title="Upload Modal"
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                    <Form.Item name="uploadType" label="Upload Type">

            <Radio.Group        
                onChange={(e) => {
                setUploadType(e.target.value);
                setFileName(""); 
                setLink("");
                 }}
                value={uploadType}>
            <Radio value="file">File</Radio>
            <Radio value="link">Link</Radio>
            </Radio.Group>
            </Form.Item>
            </Col>
        {uploadType === "file" && (
          <Form.Item label="Upload File" name="uploadFile" valuePropName="fileList" getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)} rules={[{ required: true, message: "Please select a file" }]}> 
            <Upload 
              beforeUpload={() => false} 
              maxCount={1}
              onChange={info => {
                const fileObj = info.fileList && info.fileList[0] && info.fileList[0].originFileObj;
                if (fileObj) {
                  setFileName(fileObj.name);
                  form.setFieldsValue({ name: fileObj.name });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        )}

        {uploadType === "link" && (
          <Form.Item
            label="Enter Link"
            rules={[{ required: true, message: "Please enter a link" }]}
          >
            <Input
              placeholder="Enter link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </Form.Item>
        )}
        </Row>
        <Row gutter={16}>
      <Col  className="gutter-row" span={12}>
      <Form.Item name="name" label="Name">
      <Input
        placeholder="Enter name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        // style={{ marginTop: 16 }}
      />
      </Form.Item>
      </Col>
      <Col className="gutter-row" span={12}>
      <Form.Item name="category" label="Category">
        <Select options={categoryList.map((x)=>({label:x,value:x}))}></Select>
      </Form.Item>
      </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
        <Form.Item name="description" label="Description">
            <TextArea placeholder="in 100 words"></TextArea>
        </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
        <Form.Item name="email" label="Email">
            <Input placeholder="Enter email"></Input>
        </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
        <Form.Item name="tag" label="Tags">
            {/* <Select
          mode="tags"
          value={tags}
          placeholder="Type and press Enter to add tag"
          onChange={(value) => setTags(value)}
          style={{
            width: "100%",
            minHeight: "100px",
          }}
        /> */}
        <div
          style={{
            minHeight: "10px",
            border: "1px solid #d9d9d9",
            padding: "8px",
            borderRadius: "6px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
        {tags.map((tag) => (
            <Tag
              key={tag}
              closable
              onClose={() => removeTag(tag)}
              style={{ marginBottom: "4px" }}
            >
              {tag}
            </Tag>
          ))}
          <Input
            style={{ border: "none", boxShadow: "none", width: 150 }}
            placeholder="Press Enter to add"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            list="tag-suggestions"
          />
          <datalist id="tag-suggestions">
            {tagSuggestions.filter(s => !tags.includes(s)).map((suggestion) => (
              <option value={suggestion} key={suggestion} />
            ))}
          </datalist>
        </div>
        </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
      <Form.Item name="access_groups" label="Access Group">
        <Select options={Array.isArray(accessList) ? accessList.map((x)=>({label:x,value:x})) : []}></Select>
      </Form.Item>
      </Col>
      </Row>
      </Form>
        </Modal>
    )
}

export default UploadModal;