TARGET_DIR	:=	../
FILES	:= $(shell find $(TARGET_DIR) -name '*.markdown')
TARGET	:=	$(TARGET_DIR)/pagin_data.js
SCRIPT	:= paginator.js

all : $(TARGET)
	

$(TARGET):	$(FILES) $(SCRIPT)
	@node $(SCRIPT)

clean:
	@echo clean...
	@rm -rf $(TARGET)
