package edu.wtbu.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result {
    private String flag;
    private Object data;
    private Page pages;

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Page getPages() {
        return pages;
    }

    public void setPages(Page pages) {
        this.pages = pages;
    }

    public Result(String flag, Object data, Page pages) {
        this.flag = flag;
        this.data = data;
        this.pages = pages;
    }

    public Result() {
    }

    @Override
    public String toString() {
        return "Result{" +
                "flag='" + flag + '\'' +
                ", data=" + data +
                ", pages=" + pages +
                '}';
    }
}
