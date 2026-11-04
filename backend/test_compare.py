import asyncio
import os
import fitz
import sys

def test_compare():
    print("creating pdfs...")
    doc1 = fitz.open()
    doc1.new_page().insert_text(fitz.Point(50, 50), "hello")
    doc1.save("t1.pdf")
    doc2 = fitz.open()
    doc2.new_page().insert_text(fitz.Point(50, 50), "hello world")
    doc2.save("t2.pdf")

    print("running comparison...")
    d1 = fitz.open(stream=open("t1.pdf", "rb").read(), filetype="pdf")
    d2 = fitz.open(stream=open("t2.pdf", "rb").read(), filetype="pdf")

    import difflib
    num_pages = min(d1.page_count, d2.page_count)
    for p in range(num_pages):
        page1_lines = d1[p].get_text("text").splitlines()
        page2_lines = d2[p].get_text("text").splitlines()
        matcher = difflib.SequenceMatcher(None, page1_lines, page2_lines)
        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            pass
            
    print("Done without crashing!")

if __name__ == "__main__":
    test_compare()
