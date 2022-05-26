package edu.wtbu.pojo;

public class Page {
    private int pageSize;
    private int startPage;
    private int total;

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getStartPage() {
        return startPage;
    }

    public void setStartPage(int startPage) {
        this.startPage = startPage;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public Page(int pageSize, int startPage, int total) {
        this.pageSize = pageSize;
        this.startPage = startPage;
        this.total = total;
    }

    public Page() {
    }

    @Override
    public String toString() {
        return "Page{" +
                "pageSize=" + pageSize +
                ", startPage=" + startPage +
                ", total=" + total +
                '}';
    }
}
